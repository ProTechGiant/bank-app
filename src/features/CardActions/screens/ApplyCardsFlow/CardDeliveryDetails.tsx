import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import AddressSelector from "@/components/AddressSelector";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useSubmitOrderCard from "@/hooks/use-submit-order-card";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address, OrderCardFormValues } from "@/types/Address";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useOrderCardContext } from "../../context/OrderCardContext";
import useOtpFlow from "../../hooks/use-otp";

interface CardDeliveryDetailsProps {
  primaryAddress?: Address;
}

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
  isTempAddress: boolean;
}

export default function CardDeliveryDetails({ primaryAddress }: CardDeliveryDetailsProps) {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.SetPinAndAddress">>();

  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const { t } = useTranslation();

  const otpFlow = useOtpFlow();

  const [addressData, setAddressData] = useState<AddressDataType[] | undefined>();
  const [isTempAddressButtonActive, setIsTempAddressButtonActive] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const hasTemporaryAddress = orderCardValues.formValues.AlternateAddress !== undefined;

  const buttonText = hasTemporaryAddress
    ? t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.edit")
    : t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.setAddress");

  const primaryAddressInit: AddressDataType | undefined =
    primaryAddress !== undefined
      ? {
          ...primaryAddress,
          id: PRIMARY_ID,
          isSelected: !hasTemporaryAddress,
          isTempAddress: false,
        }
      : undefined;

  useEffect(() => {
    if (route.params?.alternativeAddress !== undefined) {
      setOrderCardValues({
        ...orderCardValues,
        formValues: {
          ...orderCardValues.formValues,
          AlternateAddress: route.params?.alternativeAddress,
        },
      });
    }
  }, [route.params]);

  useEffect(() => {
    const temporaryAddress: AddressDataType | undefined =
      orderCardValues.formValues.AlternateAddress !== undefined
        ? {
            ...orderCardValues.formValues.AlternateAddress,
            id: TEMPORARY_ID,
            isTempAddress: true,
            isSelected: true,
          }
        : undefined;

    const initAddressData: AddressDataType[] | undefined =
      primaryAddressInit !== undefined && temporaryAddress !== undefined
        ? [temporaryAddress, primaryAddressInit]
        : temporaryAddress === undefined && primaryAddressInit !== undefined
        ? [primaryAddressInit]
        : undefined;
    setAddressData(initAddressData);
  }, [orderCardValues]);

  const submitOrderCardAsync = useSubmitOrderCard();

  const handleSubmit = async (values: OrderCardFormValues) => {
    try {
      const response = await submitOrderCardAsync.mutateAsync({
        values: values,
      });

      otpFlow.handle<{ CardCreateResponse: CardCreateResponse | undefined }>({
        action: {
          to: "CardActions.SetPinAndAddress",
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: generateRandomId(),
        },
        otpOptionalParams: {
          Pin: values.Pin,
        },
        onOtpRequestResend: () => {
          return submitOrderCardAsync.mutateAsync({
            values: values,
          });
        },
        onFinish: (status, payload) => {
          if (status === "cancel") {
            return;
          }
          if (status === "fail" || payload?.CardCreateResponse?.Header.ErrorId !== "0") {
            return setShowErrorModal(true);
          }

          setTimeout(() => {
            navigation.navigate("CardActions.CardOrdered", {
              cardId: payload.CardCreateResponse.Body.CardId,
            });
          }, 500);
        },
      });
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  const handleConfirm = () => {
    const selectedAddressType = addressData !== undefined && addressData.filter(data => data.isSelected === true)[0].id;

    const payload = { ...orderCardValues.formValues };

    if (selectedAddressType === PRIMARY_ID) {
      delete payload.AlternateAddress;
    }

    handleSubmit(payload);
  };

  const handleOnSetTemporaryAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      alternativeAddress: route.params?.alternativeAddress,
      navigateTo: "CardActions.SetPinAndAddress",
    });
  };

  const handleAddressSelect = (id: string) => {
    setIsTempAddressButtonActive(!hasTemporaryAddress || id === TEMPORARY_ID);
    setAddressData(
      addressData !== undefined
        ? addressData.map(data => {
            return { ...data, isSelected: data.id === id };
          })
        : undefined
    );
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <ContentContainer>
      <View style={styles.contentContainer}>
        <View style={headerStyle}>
          <Typography.Text size="large" weight="bold">
            {t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.title")}
          </Typography.Text>
        </View>
        <View style={styles.paragraph}>
          <Typography.Text>
            {hasTemporaryAddress
              ? t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.paragraph.checkHighlighted")
              : t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.paragraph.default")}
          </Typography.Text>
        </View>
        <Stack direction="vertical" gap="20p" align="stretch">
          {addressData !== undefined &&
            addressData.map((address, index) => {
              const addressLineFour = `${address.City} ${address.PostalCode}`;

              return (
                <AddressSelector
                  key={index}
                  id={address.id}
                  addressLineOne={address.AddressLineOne}
                  addressLineTwo={address.AddressLineTwo}
                  addressLineThree={address.District}
                  addressLineFour={addressLineFour}
                  isSelected={address.isSelected}
                  isTemporary={address.isTempAddress}
                  onPress={handleAddressSelect}
                />
              );
            })}
        </Stack>
      </View>
      <Button onPress={handleConfirm} loading={submitOrderCardAsync.isLoading}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          {t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.confirm")}
        </Typography.Text>
      </Button>
      <Button onPress={handleOnSetTemporaryAddress} variant="tertiary" disabled={!isTempAddressButtonActive}>
        {buttonText}
      </Button>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </ContentContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  paragraph: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
});

const PRIMARY_ID = "primary";
const TEMPORARY_ID = "temporary";

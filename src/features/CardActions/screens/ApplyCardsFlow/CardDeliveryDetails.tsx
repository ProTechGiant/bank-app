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
import usePrimaryAddress from "@/hooks/use-primary-address";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address, OrderCardFormValues } from "@/types/Address";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useOrderCardContext } from "../../context/OrderCardContext";
import useSubmitOrderCard from "../../hooks/query-hooks";
import useOtpFlow from "../../hooks/use-otp";
import { CardCreateResponse } from "../../types";

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
  isTempAddress: boolean;
}

interface CardDeliveryDetailsProps {
  onCancel: () => void;
}

export default function CardDeliveryDetails({ onCancel }: CardDeliveryDetailsProps) {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.SetPinAndAddress">>();
  const { t } = useTranslation();

  const primaryAddress = usePrimaryAddress();
  const submitOrderCardAsync = useSubmitOrderCard();
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const otpFlow = useOtpFlow();

  const [addresses, setAddresses] = useState<AddressDataType[]>([]);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const hasTemporaryAddress = orderCardValues.formValues.AlternateAddress !== undefined;
  const isTemporaryAddressSelected = addresses?.find(v => v.isSelected)?.id === TEMPORARY_ID;

  useEffect(() => {
    if (!primaryAddress.isError) return;
    setIsErrorModalVisible(primaryAddress.isError);
  }, [primaryAddress.isError]);

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

    const primaryAddressInit: AddressDataType | undefined =
      primaryAddress.data !== undefined
        ? {
            ...primaryAddress.data,
            id: PRIMARY_ID,
            isSelected: !hasTemporaryAddress,
            isTempAddress: false,
          }
        : undefined;

    const initAddressData: AddressDataType[] | undefined =
      primaryAddressInit !== undefined && temporaryAddress !== undefined
        ? [temporaryAddress, primaryAddressInit]
        : temporaryAddress === undefined && primaryAddressInit !== undefined
        ? [primaryAddressInit]
        : undefined;

    setAddresses(initAddressData);
  }, [orderCardValues]);

  const handleSubmit = async (values: OrderCardFormValues) => {
    try {
      const response = await submitOrderCardAsync.mutateAsync({
        values: values,
      });

      otpFlow.handle<{ CardCreateResponse: CardCreateResponse }>({
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
            setTimeout(() => setIsErrorModalVisible(true), 500);
            return;
          }

          setTimeout(() => {
            navigation.navigate("CardActions.CardOrderedScreen", {
              cardId: payload.CardCreateResponse.Body.CardId,
            });
          }, 500);
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
    }
  };

  const handleOnConfirm = () => {
    const selectedAddressType = addresses !== undefined && addresses.filter(data => data.isSelected === true)[0].id;

    const payload = { ...orderCardValues.formValues };

    if (selectedAddressType === PRIMARY_ID) {
      delete payload.AlternateAddress;
    }

    handleSubmit(payload);
  };

  const handleOnSetTemporaryAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      initialValue: route.params?.alternativeAddress,
      navigateTo: "CardActions.SetPinAndAddress",
    });
  };

  const handleOnAddressPress = (addressId: string) => {
    setAddresses(current =>
      current.map(value => ({
        ...value,
        isSelected: value.id === addressId,
      }))
    );
  };

  const handleOnCloseError = () => {
    setIsErrorModalVisible(false);
    onCancel();
  };

  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <>
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
            {addresses !== undefined &&
              addresses.map((address, index) => {
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
                    onPress={handleOnAddressPress}
                  />
                );
              })}
          </Stack>
        </View>
        <Button onPress={handleOnConfirm} loading={submitOrderCardAsync.isLoading}>
          <Typography.Text color="neutralBase-50" size="body" weight="medium">
            {t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.confirm")}
          </Typography.Text>
        </Button>
        <Button
          onPress={handleOnSetTemporaryAddress}
          variant="tertiary"
          disabled={hasTemporaryAddress && !isTemporaryAddressSelected}>
          {hasTemporaryAddress
            ? t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.edit")
            : t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.setAddress")}
        </Button>
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={handleOnCloseError}
      />
    </>
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

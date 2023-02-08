import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { Address, OrderCardFormValues, useOrderCardContext } from "@/features/ApplyCards/context/OrderCardContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AddressSelector from "./AddressSelector";
import useSubmitOrderCard from "./use-submit-order-card";

interface CardDeliveryDetailsProps {
  primaryAddress?: Address;
}

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
  isTempAddress: boolean;
}

export default function CardDeliveryDetails({ primaryAddress }: CardDeliveryDetailsProps) {
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignSelf: "flex-start",
      marginBottom: theme.spacing["16p"],
    }),
    []
  );

  const navigation = useNavigation();
  const { orderCardValues } = useOrderCardContext();

  const { t } = useTranslation();

  const API_SUCCESS_MESSAGE = "Successful request card creation";
  const PRIMARY_ID = "primary";
  const TEMPORARY_ID = "temporary";

  const GENERIC_ERROR = {
    name: "error",
    title: t("errors.generic.title"),
    message: t("errors.generic.message"),
  };

  const hasTemporaryAddress = orderCardValues.formValues.alternateAddress !== undefined;
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

  const [addressData, setAddressData] = useState<AddressDataType[] | undefined>();

  const [isTempAddressButtonActive, setIsTempAddressButtonActive] = useState(true);

  useEffect(() => {
    const temporaryAddress: AddressDataType | undefined =
      orderCardValues.formValues.alternateAddress !== undefined
        ? {
            ...orderCardValues.formValues.alternateAddress,
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

  const showErrorAlert = (title: string, content: string) => {
    Alert.alert(title, content, [
      {
        text: "OK",
        onPress: () => navigation.navigate("Temporary.LandingScreen"),
      },
    ]);
  };

  const submitOrderCardAsync = useSubmitOrderCard();

  const handleSubmit = async (values: OrderCardFormValues) => {
    try {
      await submitOrderCardAsync.mutateAsync(values).then(res => {
        if (res.response === API_SUCCESS_MESSAGE) {
          navigation.navigate("ApplyCards.CardOrdered");
        } else {
          showErrorAlert(GENERIC_ERROR.title, GENERIC_ERROR.message);
        }
      });
    } catch (error) {
      showErrorAlert(GENERIC_ERROR.title, GENERIC_ERROR.message);
    }
  };

  const handleConfirm = () => {
    const selectedAddressType = addressData !== undefined && addressData.filter(data => data.isSelected === true)[0].id;
    const payload = { ...orderCardValues.formValues };

    if (selectedAddressType === PRIMARY_ID) {
      delete payload.alternateAddress;
    }

    handleSubmit(payload);
  };

  const handleSetTemporaryAddress = () => {
    navigation.navigate("ApplyCards.SetTemporaryAddress");
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
        <Stack direction="vertical" gap="20p">
          {addressData !== undefined &&
            addressData.map((address, index) => {
              const addressLineFour = `${address.city} ${address.postalCode}`;

              return (
                <AddressSelector
                  key={index}
                  id={address.id}
                  addressLineOne={address.addressLineOne}
                  addressLineTwo={address.addressLineTwo}
                  addressLineThree={address.district}
                  addressLineFour={addressLineFour}
                  isSelected={address.isSelected}
                  isTemporary={address.isTempAddress}
                  onPress={handleAddressSelect}
                />
              );
            })}
        </Stack>
      </View>
      <Button onPress={handleConfirm} type={submitOrderCardAsync.isLoading ? "loader" : "no icons"}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          {t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.confirm")}
        </Typography.Text>
      </Button>
      <Button
        onPress={handleSetTemporaryAddress}
        variant="tertiary"
        disabled={!isTempAddressButtonActive || submitOrderCardAsync.isLoading}>
        <Typography.Text color="primaryBase+20" size="body">
          {buttonText}
        </Typography.Text>
      </Button>
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

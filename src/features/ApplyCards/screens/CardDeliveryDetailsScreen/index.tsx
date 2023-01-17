import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Stack } from "@/components/Stack";
import Typography from "@/components/Typography";
import { OrderCardFormValues, useOrderCardContext } from "@/features/ApplyCards/context/OrderCardContext";
import { mockPrimaryDeliveryAddress } from "@/mocks/deliveryAddressData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AddressSelector from "./AddressSelector";
import useSubmitOrderCard from "./use-submit-order-card";

export default function CardDeliveryDetailsScreen() {
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
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
    title: t("ApplyCards.CardDeliveryDetailsScreen.error.title"),
    message: t("ApplyCards.CardDeliveryDetailsScreen.error.message"),
  };

  const hasTemporaryAddress = orderCardValues.formValues.alternateAddress !== undefined;
  const buttonText = hasTemporaryAddress
    ? t("ApplyCards.CardDeliveryDetailsScreen.buttons.edit")
    : t("ApplyCards.CardDeliveryDetailsScreen.buttons.setAddress");
  const primaryAddress = mockPrimaryDeliveryAddress.addresses.map(data => {
    return { ...data, id: PRIMARY_ID, is_selected: !hasTemporaryAddress, is_temp_address: false };
  });

  const [addressData, setAddressData] = useState(primaryAddress);
  const [isTempAddressButtonActive, setIsTempAddressButtonActive] = useState(true);

  useEffect(() => {
    const temporaryAddress = hasTemporaryAddress
      ? [
          {
            ...orderCardValues.formValues.alternateAddress,
            id: TEMPORARY_ID,
            is_temp_address: true,
            is_selected: true,
          },
        ]
      : [];
    const initAddressData = hasTemporaryAddress ? [...temporaryAddress, ...primaryAddress] : primaryAddress;
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
    const selectedAddressType = !isEmpty(addressData) && addressData.filter(data => data.is_selected === true)[0].id;
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
      addressData.map(data => {
        return { ...data, is_selected: data.id === id };
      })
    );
  };

  const handleOnBack = () => {
    navigation.navigate("ApplyCards.CreateCardPin");
  };

  return (
    <Page>
      <NavHeader
        title={t("ApplyCards.CardDeliveryDetailsScreen.navTitle")}
        backButton={true}
        backButtonHandler={handleOnBack}>
        <ProgressIndicator currentStep={3} totalStep={3} />
      </NavHeader>
      <ContentContainer>
        <View style={styles.contentContainer}>
          <View style={headerStyle}>
            <Typography.Text size="large" weight="bold">
              {t("ApplyCards.CardDeliveryDetailsScreen.title")}
            </Typography.Text>
          </View>
          <View style={styles.paragraph}>
            <Typography.Text>{t("ApplyCards.CardDeliveryDetailsScreen.paragraph")}</Typography.Text>
          </View>
          <Stack space="medium">
            {!isEmpty(addressData) &&
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
                    isSelected={address.is_selected}
                    isTemporary={address.is_temp_address}
                    handlePress={handleAddressSelect}
                  />
                );
              })}
          </Stack>
        </View>
        <Button onPress={handleConfirm} type={submitOrderCardAsync.isLoading ? "loader" : "no icons"}>
          <Typography.Text color="neutralBase-50" size="body" weight="medium">
            {t("ApplyCards.CardDeliveryDetailsScreen.buttons.confirm")}
          </Typography.Text>
        </Button>
        <Button onPress={handleSetTemporaryAddress} variant="tertiary" disabled={!isTempAddressButtonActive}>
          <Typography.Text color="tintBase+20" size="body">
            {buttonText}
          </Typography.Text>
        </Button>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  paragraph: {
    marginBottom: 24,
  },
});

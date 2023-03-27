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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { Address } from "@/types/Address";

import { CardActionsStackParams } from "../../CardActionsStack";

interface ConfirmDeliveryAddressProps {
  primaryAddress?: Address;
  reason: string | undefined;
  cardId: string;
}

interface AddressDataType extends Address {
  id: string;
  isSelected: boolean;
  isTempAddress: boolean;
}

export default function ConfirmDeliveryAddress({ primaryAddress, reason, cardId }: ConfirmDeliveryAddressProps) {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.ReportCardScreen">>();

  const navigation = useNavigation();
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  //@todo enabled when BE ready const useReportCardAsync = useReportCard();

  const { t } = useTranslation();

  const PRIMARY_ID = "primary";
  const TEMPORARY_ID = "temporary";

  let selectedAddress: AddressDataType;

  const hasTemporaryAddress = route.params.alternativeAddress !== undefined;
  const buttonText = hasTemporaryAddress
    ? t("ApplyCards.SetPinAndAddressScreen.CardDeliveryDetails.buttons.edit")
    : t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.differentAddressBtn");

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
      route.params.alternativeAddress !== undefined
        ? {
            ...route.params.alternativeAddress,
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
  }, [primaryAddress, route.params]);

  const handleConfirm = () => {
    if (addressData === undefined) {
      setShowErrorModal(true);
      return;
    }

    selectedAddress = addressData.filter(data => data.isSelected === true)[0];
    console.log(selectedAddress);

    setIsConfirmationModalVisible(true);
  };

  const handleSetTemporaryAddress = () => {
    navigation.navigate("CardActions.SetTemporaryAddressScreen", {
      alternativeAddress: route.params.alternativeAddress,
      navigateTo: "CardActions.ReportCardScreen",
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

  const handleOnContinue = async () => {
    setIsConfirmationModalVisible(false);

    if (reason === undefined) {
      setShowErrorModal(true);
      return;
    }
    navigation.navigate("CardActions.ReportCardSuccessScreen", { cardId: cardId });

    // @todo correct BE integration with OTP varification
    //  const correlationId = generateRandomId();
    // const request = {
    //   cardId: cardId,
    //   status: reason,
    //   correlationId: correlationId,
    //   alteranativeAddress:
    //     selectedAddress.id === PRIMARY_ID
    //       ? undefined
    //       : {
    //           AddressLineOne: selectedAddress.AddressLineOne,
    //           AddressLineTwo: selectedAddress.AddressLineTwo,
    //           District: selectedAddress.District,
    //           City: selectedAddress.City,
    //           PostalCode: selectedAddress.PostalCode,
    //         },
    // };

    // console.log(request);
    // try {
    //   const response = await useReportCardAsync.mutateAsync(request);

    //   if (response.OtpId === undefined) {
    //     setShowErrorModal(true);
    //     return;
    //   }

    //   navigation.navigate("CardActions.OneTimePasswordModal", {
    //     correlationId,
    //     redirect: "CardActions.LoadingSingleCardScreen",
    //     action: "report-card",
    //     otp: {
    //       otpId: response.OtpId,
    //       otpCode: response.OtpCode,
    //       phoneNumber: response.PhoneNumber,
    //     },
    //   });
    // } catch (error) {
    //   setShowErrorModal(true);
    //   warn("card-actions", "Could not report card: ", JSON.stringify(error));
    // }
  };

  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignSelf: "flex-start",
      marginBottom: theme.spacing["16p"],
    }),
    []
  );

  const paragraph = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["24p"],
    color: "neutralBase+30",
  }));

  const button = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <ContentContainer>
      <View style={styles.contentContainer}>
        <View style={headerStyle}>
          <Typography.Text size="title1" weight="semiBold">
            {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.navTitle")}
          </Typography.Text>
        </View>
        <Typography.Text style={paragraph} weight="regular" size="callout">
          {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.description")}
        </Typography.Text>
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

      <Button onPress={handleConfirm}>
        <Typography.Text color="neutralBase-50" size="body" weight="medium">
          {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.buttonTitle")}
        </Typography.Text>
      </Button>
      <View style={button}>
        <Button onPress={handleSetTemporaryAddress} variant="tertiary" disabled={!isTempAddressButtonActive}>
          {buttonText}
        </Button>
      </View>
      <NotificationModal
        variant="confirmations"
        title={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertTitle")}
        message={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertMessage")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnContinue}>
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsConfirmationModalVisible(false)}>
              {t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.cancelButton")}
            </Button>
          ),
        }}
      />
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
});

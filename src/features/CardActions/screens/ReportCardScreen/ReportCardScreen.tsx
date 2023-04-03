import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, useWindowDimensions, View } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import usePrimaryAddress from "@/hooks/use-primary-address";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import { useFreezeCard } from "../../hooks/query-hooks";
import ConfirmDeliveryAddress from "./ConfirmDeliveryAddress";
import ReportCardSuccessScreen from "./ReportCardSuccessScreen";
import SelectReportReason from "./SelectReportReason";

export default function ReportCardScreen() {
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.ReportCardScreen">>();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const cardId = route.params.cardId;
  const primaryAddress = usePrimaryAddress();
  const freezeCardAsync = useFreezeCard();

  const [mode, setMode] = useState<"input" | "address" | "done">("input");
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<string>();
  const [selectedAlternativeAddress, setSelectedAlternativeAddress] = useState<Address | undefined>();

  const currentStep = mode === "input" ? 1 : 2;
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: dimensions.width * (currentStep - 1) });
  }, [currentStep, mode]);

  const handleOnSelectReasonPress = (selectedReason: string) => {
    if (primaryAddress.isError) {
      setIsErrorModalVisible(true);
    } else {
      setReportReason(selectedReason);
      setMode("address");
    }
  };

  const handleOnFreezePress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from back-end");

      navigation.goBack();
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnConfirm = async () => {
    setIsConfirmationModalVisible(false);

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

  const handleOnBackPress = () => {
    if (mode === "address") return setMode("input");
    navigation.goBack();
  };

  return mode === "done" ? (
    <ReportCardSuccessScreen />
  ) : (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.ReportCardScreen.navTitle")} onBackPress={handleOnBackPress}>
          <ProgressIndicator currentStep={currentStep} totalStep={2} />
        </NavHeader>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}>
          <View style={{ width: dimensions.width }}>
            <SelectReportReason
              isLoading={primaryAddress.isLoading}
              onContinuePress={handleOnSelectReasonPress}
              onFreezePress={handleOnFreezePress}
            />
          </View>
          <View style={{ width: dimensions.width }}>
            <ConfirmDeliveryAddress
              onConfirm={alternativeAddress => {
                setSelectedAlternativeAddress(alternativeAddress);
                setIsConfirmationModalVisible(true);
              }}
              primaryAddress={primaryAddress.data}
            />
          </View>
        </ScrollView>
      </Page>
      <NotificationModal
        variant="error"
        title={primaryAddress.isError ? t("CardActions.ReportCardScreen.addressErrorTitle") : t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <NotificationModal
        variant="confirmations"
        title={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertTitle")}
        message={t("CardActions.ReportCardScreen.ConfirmDeliveryAddress.alertMessage")}
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnConfirm}>
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
    </>
  );
}

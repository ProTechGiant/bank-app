import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, View, ViewStyle } from "react-native";

import { OnlineTransactionLimitIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  AddToAppleWalletIcon,
  CardCloseAndReplacement,
  ChangeCardPinIcon,
  FaqsIcon,
  OrderCardIcon,
  PermanentCardClose,
  PosIcon,
  ReportIcon,
  ShowPinIcon,
  StatementIcon,
} from "../assets/icons";
import { CardSettingsSection } from "../components";
import { useCard, useCardSettings, useChangeCardStatus, useFreezeCard } from "../hooks/query-hooks";

export default function CardSettingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardSettingsScreen">>();
  const card = useCard(route.params.cardId);
  const changeCardStatus = useChangeCardStatus();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const settings = useCardSettings(route.params.cardId);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [showCancelCardSuccessAlert, setShowCancelCardSuccessAlert] = useState(false);
  const [isApplyPhysicalCardModalVisible, setIsApplyPhysicalCardModalVisible] = useState(false);
  const { isLoading: freezeLoading } = useFreezeCard();
  const [, setIsLockConfirmModalVisible] = useState(false);

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnChangePinCodePress = () => {
    navigation.navigate("CardActions.ResetPincodeScreen", {
      cardId: route.params.cardId,
      cardIdType: card.data?.CardType,
    });
  };

  const handleOnPOSTransactionLimitPress = () => {
    navigation.navigate("CardActions.POSLimitScreen", {
      cardId: route.params.cardId,
    });
  };

  const handleOnCancelCardPress = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleSuccessOkPress = () => {
    setShowCancelCardSuccessAlert(false);
  };

  const handleOnConfirmPress = async () => {
    setIsConfirmationModalVisible(false);
    try {
      const response = await changeCardStatus.mutateAsync({
        cardId: route.params.cardId,
        status: "CANCELLED",
      });

      if (response.IsOtpRequired) {
        otpFlow.handle({
          action: {
            to: "CardActions.CardSettingsScreen",
            params: {
              cardId: route.params.cardId,
            },
          },
          otpOptionalParams: {
            CardId: route.params.cardId,
            isOtpAlreadySent: true,
          },
          otpChallengeParams: {
            OtpId: response.OtpId,
            PhoneNumber: response.PhoneNumber,
          },
          otpVerifyMethod: "card-actions",
          onOtpRequest: async () => {
            const resendResponse = await changeCardStatus.mutateAsync({
              cardId: route.params.cardId,
              status: "CANCELLED",
            });

            return resendResponse;
          },
          onFinish: status => {
            if (status === "cancel") {
              return;
            }
            if (status === "fail") {
              settings.refetch();
            }
          },
        });
      }
    } catch (error) {
      setIsErrorModalVisible(true);
    }
  };

  const handleOnRequestPhysicalCard = () => {
    setIsApplyPhysicalCardModalVisible(true);
  };

  const handleOnRequestPhysicalCardConfirmPress = () => {
    setIsApplyPhysicalCardModalVisible(false);
    navigation.navigate("CardActions.ConfirmCardDeliveryAddress", {
      cardId: "card.CardId",
      cardType: "card.CardType",
      cardHolderName: "card.AccountName",
    });
  };

  const handleOnReportPress = () => {
    navigation.navigate("CardActions.ReportCardScreen", {
      cardId: "card.CardId",
      cardStatus: card.Status,
    });
  };

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({ paddingTop: theme.spacing["24p"] }));

  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);

  const viewStyles = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
    borderRadius: theme.radii.xxlarge,
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={NavHeaderColor} />
      <NavHeader
        title={t("CardActions.SettingsScreen.title")}
        onBackPress={handleOnBackPress}
        backgroundColor={NavHeaderColor}
        backgroundAngledColor={NavHeaderColor}
        variant="white"
      />
      <ContentContainer style={containerStyles} isScrollView>
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.showCardPIN")}
          icon={
            <View style={viewStyles}>
              <ShowPinIcon />
            </View>
          }
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.changeCardPIN")}
          icon={
            <View style={viewStyles}>
              <ChangeCardPinIcon />
            </View>
          }
          onPress={handleOnChangePinCodePress}
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.orderPhysicalCard")}
          icon={
            <View style={viewStyles}>
              <OrderCardIcon />
            </View>
          }
          onPress={handleOnRequestPhysicalCard}
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.report")}
          icon={
            <View style={viewStyles}>
              <ReportIcon />
            </View>
          }
          onPress={handleOnReportPress}
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.posLimit")}
          icon={
            <View style={viewStyles}>
              <PosIcon />
            </View>
          }
          onPress={handleOnPOSTransactionLimitPress}
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.onlineLimit")}
          icon={
            <View style={viewStyles}>
              <OnlineTransactionLimitIcon />
            </View>
          }
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.statements")}
          icon={
            <View style={viewStyles}>
              <StatementIcon />
            </View>
          }
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.cardClose")}
          icon={
            <View style={viewStyles}>
              <CardCloseAndReplacement />
            </View>
          }
          onPress={handleOnCancelCardPress}
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.addToWallet")}
          icon={
            <View style={viewStyles}>
              <AddToAppleWalletIcon />
            </View>
          }
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.permanentCardClosure")}
          icon={
            <View style={viewStyles}>
              <PermanentCardClose />
            </View>
          }
        />
        <CardSettingsSection
          title={t("CardActions.SettingsScreen.FAQs")}
          icon={
            <View style={viewStyles}>
              <FaqsIcon />
            </View>
          }
          /// TODO will be updated based on navigation
        />
      </ContentContainer>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <NotificationModal
        variant="warning"
        title={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardTitle")}
        message={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardDescription")}
        testID="CardActions.CardSettingsScreen:CancelCardModal"
        isVisible={isConfirmationModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmPress} testID="CardActions.CardSettingsScreen:CancelCardModalConfirmButton">
              {t("CardActions.CardSettingsScreen.cancelCardAlert.confirm")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsConfirmationModalVisible(false)}
              testID="CardActions.CardSettingsScreen:CancelCardModalCancelButton">
              {t("CardActions.CardSettingsScreen.cancelCardAlert.cancel")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="success"
        title={t("CardActions.CardSettingsScreen.cancelCardAlert.cancelCardSuccessMessage")}
        testID="CardActions.CardSettingsScreen:CancelCardSuccessModal"
        isVisible={showCancelCardSuccessAlert}
        buttons={{
          primary: (
            <Button
              onPress={handleSuccessOkPress}
              testID="CardActions.CardSettingsScreen:CancelCardSuccessModalOkButton">
              {t("CardActions.CardSettingsScreen.cancelCardAlert.Ok")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              loading={freezeLoading}
              disabled={freezeLoading}
              onPress={handleOnRequestPhysicalCardConfirmPress}
              testID="CardActions.CardDetailsScreen:RequestPhysicalCardModalConfirmButton">
              {t("CardActions.CardDetailsScreen.applyForPhysicalCardConfirmationModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsApplyPhysicalCardModalVisible(false)}
              testID="CardActions.CardDetailsScreen:RequestPhysicalCardModalCancelButton">
              {t("CardActions.CardDetailsScreen.applyForPhysicalCardConfirmationModal.cancelButton")}
            </Button>
          ),
        }}
        title={t("CardActions.CardDetailsScreen.applyForPhysicalCardConfirmationModal.title")}
        isVisible={isApplyPhysicalCardModalVisible}
        onClose={() => {
          setIsLockConfirmModalVisible(false);
        }}
        testID="CardActions.CardDetailsScreen:RequestPhysicalCardModal"
      />
    </Page>
  );
}

import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

import { CardSettingsIcon, CopyIcon, ErrorOutlineIcon, ReportIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import AddToAppleWalletButton from "@/features/ApplyCards/screens/AddToAppleWalletScreen/AddToAppleWalletButton";
import { warn } from "@/logger";
import { inactiveCards } from "@/mocks/inactiveCards";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import ViewPinModal from "../../components/ViewPinModal";
import {
  useCards,
  useFreezeCard,
  useRequestViewPinOtp,
  useUnfreezeCard,
  useUnmaskedCardDetails,
} from "../../query-hooks";
import { DetailedCardResponse } from "../../types";
import CardIconButtons from "./CardIconButtons";
import ListItemText from "./ListItemText";
import SingleUseIconButtons from "./SingleUseIconButtons";
import UpgradeToCroatiaPlus from "./UpgradeToCroatiaPlus";

export default function CardDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const { data } = useCards(); // @todo to use getCardbyID when BE implements
  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();
  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const requestUnmaskedCardDetailsAsync = useUnmaskedCardDetails();

  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(route.params?.action === "view-pin");
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showErrorCopy, setShowErrorCopy] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [cardDetails, setCardDetails] = useState<DetailedCardResponse | undefined>();

  const selectedCard = data?.Cards.find(card => card.CardId === route.params.cardId);
  const cardType = route.params.cardType;
  const cardStatus = route.params.cardStatus;
  const cardId = route.params.cardId;

  //TODO: retrieve card details to show an active card / frozen card
  useEffect(() => {
    setIsShowingDetails(false);

    if (undefined === route.params) return;

    if (route.params.action === "unfreeze") {
      setIsCardFrozen(false);
    } else if (route.params.action === "freeze") {
      setIsCardFrozen(true);
    } else if (route.params?.action === "view-pin") {
      setPin(route.params.pin);
      // Add delay to show Notification Modal otherwise because it will be blocked by the OTP modal and view pin modal cannot be shown
      setTimeout(() => {
        setIsViewingPin(true);
      }, 500);
    } else if (route.params?.action === "generate-single-use-card") {
      setShowNotificationAlert(true);
    } else if (route.params?.action === "show-details") {
      if (route.params?.detailedCardResponse === undefined) {
        setIsShowingDetails(false);
        setShowErrorModal(true);
      } else {
        setCardDetails(route.params?.detailedCardResponse);
        setIsShowingDetails(true);
      }
    }
  }, [route.params]);

  const handleOnAddToAppleWallet = () => {
    setIsShowingDetails(false);
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnCardSettingsPress = () => {
    if (undefined === cardStatus) return;
    navigation.navigate("CardActions.CardSettingsScreen", { cardStatus, cardId });
  };

  const handleOnReportPress = () => {
    setIsShowingDetails(false);
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnUpgradePress = () => {
    setIsShowingDetails(false);

    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnShowDetailsPress = async () => {
    if (!isShowingDetails) {
      const correlationId = generateRandomId();
      try {
        const response = await requestUnmaskedCardDetailsAsync.mutateAsync({ cardId, correlationId });
        if (response.OtpCode !== undefined && response.OtpId !== undefined) {
          navigation.navigate("CardActions.OneTimePasswordModal", {
            redirect: "CardActions.CardDetailsScreen",
            action: "show-details",
            correlationId: correlationId,
            cardId: cardId,
            cardType: cardType,
            otp: {
              otpId: response.OtpId,
              otpCode: response.OtpCode,
              phoneNumber: response.PhoneNumber,
            },
          });
        } else {
          setIsShowingDetails(false);
          setShowErrorModal(true);
        }
      } catch (error) {
        setIsShowingDetails(false);
        setShowErrorModal(true);
        warn("card-actions", "Could not show card details: ", JSON.stringify(error));
      }
    } else {
      setIsShowingDetails(false);
    }
  };

  const handleOnCopyPress = () => {
    if (showBanner) {
      // hide the already shown banner to avoid duplicate banners
      setShowBanner(false);
    }
    if (cardDetails?.CardNumber !== undefined) {
      Clipboard.setString(cardDetails?.CardNumber);
    } else {
      setShowErrorCopy(true);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 4000);
    }
    fetchCopiedText();
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setShowErrorCopy(text.length < 0);
    setShowBanner(true);
    setTimeout(() => {
      setShowBanner(false);
    }, 4000);
  };

  const handleOnPressActivate = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnFreezePress = () => {
    isCardFrozen ? handleOnUnfreezeCardPress() : handleOnFreezeCardPress();
  };

  const handleOnFreezeCardPress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });
      setIsShowingDetails(false);

      response.Status === "freeze" ? setIsCardFrozen(true) : setShowErrorModal(true);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async () => {
    const correlationId = generateRandomId();

    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
        navigation.navigate("CardActions.OneTimePasswordModal", {
          redirect: "CardActions.CardDetailsScreen",
          action: "unfreeze",
          correlationId: correlationId,
          cardId: cardId,
          otp: {
            otpId: response.OtpId,
            otpCode: response.OtpCode,
            phoneNumber: response.PhoneNumber,
          },
        });
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnCloseNotification = () => {
    setShowNotificationAlert(false);
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleOnBackPress = () => {
    // if  from creation -> navigate to Home else goBack
    if (route.params.action === "generate-single-use-card") {
      navigation.navigate("Temporary.LandingScreen");
    } else {
      navigation.goBack();
    }
  };

  const handleOnViewPinPress = async () => {
    setIsShowingDetails(false);
    const correlationId = generateRandomId();

    try {
      const response = await requestViewPinOtpAsync.mutateAsync({ cardId, correlationId });
      if (response.OtpCode !== undefined) {
        navigation.navigate("CardActions.OneTimePasswordModal", {
          redirect: "CardActions.CardDetailsScreen",
          action: "view-pin",
          cardId: cardId,
          correlationId: correlationId,
          otp: {
            otpCode: response.OtpCode,
            otpId: response.OtpId,
            phoneNumber: response.PhoneNumber,
          },
        });
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not retrieve pin OTP: ", JSON.stringify(error));
    }
  };

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["20p"],
  }));

  const walletButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const disabledIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);
  const iconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <>
      <DismissibleBanner
        visible={showBanner}
        message={
          !showErrorCopy
            ? t("CardActions.CardDetailsScreen.copyClipboard")
            : t("CardActions.CardDetailsScreen.errorCopyClipboard")
        }
        icon={!showErrorCopy ? <CopyIcon /> : <ErrorOutlineIcon />}
        variant={showErrorCopy ? "error" : "default"}
      />
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={
            cardType === "standard"
              ? t("CardActions.CardDetailsScreen.navTitleStandard")
              : cardType === "plus"
              ? t("CardActions.CardDetailsScreen.navTitlePlus")
              : t("CardActions.CardDetailsScreen.navTitleSingleUse")
          }
          onBackPress={handleOnBackPress}
        />
        <ContentContainer isScrollView>
          <View style={cardContainerStyle}>
            {isCardFrozen ? (
              <BankCard.Inactive
                type="frozen"
                actionButton={<BankCard.ActionButton title={t("CardActions.cardFrozen")} type="dark" />}
              />
            ) : cardStatus === "inactive" && cardType !== "single-use" ? (
              <BankCard.Inactive
                type="inactive"
                label={t("CardActions.CardDetailsScreen.inactiveCard.label")}
                actionButton={
                  <BankCard.ActionButton
                    type="light"
                    title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                    onPress={handleOnPressActivate}
                  />
                }
              />
            ) : !isShowingDetails ? (
              <BankCard.Active cardNumber={selectedCard?.LastFourDigits} cardType={cardType} />
            ) : (
              <BankCard.Unmasked
                cardNumber={cardDetails ? cardDetails.CardNumber : ""}
                cardType={cardType}
                cardDetails={{
                  endDate: cardDetails ? cardDetails.ExpDate : "",
                  securityCode: cardDetails ? cardDetails.Cvv : "",
                }}
                onCopyPress={handleOnCopyPress}
              />
            )}
          </View>
          {cardType === "single-use" ? (
            <SingleUseIconButtons onPressShowDetails={handleOnShowDetailsPress} isShowingDetails={isShowingDetails} />
          ) : cardStatus !== "inactive" ? (
            <CardIconButtons
              isViewingPin={isViewingPin}
              isCardFrozen={isCardFrozen}
              onShowDetailsPress={handleOnShowDetailsPress}
              onViewPinPress={handleOnViewPinPress}
              onFreezePress={handleOnFreezePress}
              isShowingDetails={isShowingDetails}
            />
          ) : null}
          <View style={separatorStyle} />
          {cardType !== "single-use" ? (
            <>
              {Platform.OS === "ios" ? (
                <View style={walletButtonContainer}>
                  <AddToAppleWalletButton onPress={handleOnAddToAppleWallet} />
                </View>
              ) : null}
              <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
                <ListItemLink
                  icon={<CardSettingsIcon color={iconColor} />}
                  onPress={handleOnCardSettingsPress}
                  title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
                />
                <ListItemLink
                  disabled={cardStatus === "inactive" ? true : false}
                  icon={
                    cardStatus === "inactive" ? (
                      <ReportIcon color={disabledIconColor} />
                    ) : (
                      <ReportIcon color={iconColor} />
                    )
                  }
                  onPress={handleOnReportPress}
                  title={t("CardActions.CardDetailsScreen.reportButton")}
                />
              </ListSection>
              <View style={separatorStyle} />
            </>
          ) : null}
          <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
            <ListItemText
              title={t("CardActions.CardDetailsScreen.accountName")}
              value={cardType === "active" ? selectedCard?.AccountName : inactiveCards[0].AccountName}
            />
            <ListItemText
              title={t("CardActions.CardDetailsScreen.accountNumber")}
              value={cardType === "active" ? selectedCard?.AccountNumber : inactiveCards[0].AccountNumber}
            />
          </ListSection>
          {cardType === "standard" ? (
            <>
              <View style={separatorStyle} />
              <View style={styles.upgradeContainer}>
                <UpgradeToCroatiaPlus onPress={handleOnUpgradePress} />
              </View>
            </>
          ) : null}
        </ContentContainer>
      </Page>

      <NotificationModal
        variant="success"
        onClose={handleOnCloseNotification}
        message={t("CardActions.SingleUseCard.CardCreation.successMessage")}
        title={t("CardActions.SingleUseCard.CardCreation.successTitle")}
        isVisible={showNotificationAlert}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={handleOnErrorModalClose}
      />
      {pin !== undefined ? (
        <ViewPinModal
          pin={pin}
          visible={isViewingPin}
          onClose={() => {
            setIsViewingPin(false);
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  upgradeContainer: {
    alignItems: "center",
  },
});

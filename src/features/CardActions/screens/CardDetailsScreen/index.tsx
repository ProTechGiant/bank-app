import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

import { CardSettingsIcon, CopyIcon, ErrorOutlineIcon, ReportIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../../CardActionsStack";
import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import { useFreezeCard, useUnfreezeCard } from "../../query-hooks";
import CardIconButtons from "./CardIconButtons";
import ListItemText from "./ListItemText";
import SingleUseIconButtons from "./SingleUseIconButtons";
import UpgradeToCroatiaPlus from "./UpgradeToCroatiaPlus";

const cardDetails = {
  cardNumber: "1234 1234 1234 1234",
  accountName: "Main account",
  endDate: "02/25",
  securityCode: 122,
};

export default function CardDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();

  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(false);
  const [isShowingDetails, setIsShowingDetails] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showErrorCopy, setShowErrorCopy] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const cardType = route.params.cardType;
  const cardStatus = route.params.cardStatus;
  const cardId = route.params.cardId;

  useEffect(() => {
    setShowNotificationAlert(route.params.isCardCreated ?? false);
  }, [route.params.isCardCreated]);

  //TODO: retrieve card details to show an active card / frozen card
  useEffect(() => {
    if (route.params.action === "unfreeze") {
      setIsCardFrozen(false);
    } else if (route.params.action === "freeze") {
      setIsCardFrozen(true);
    }
  }, [route.params]);

  const handleOnAddToAppleWallet = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnActiveCardSettingsPress = () => {
    navigation.navigate("CardActions.CardSettingsScreen", { cardStatus: "active" });
  };

  const handleOnInactiveCardSettingsPress = () => {
    navigation.navigate("CardActions.CardSettingsScreen", { cardStatus: "inactive" });
  };

  const handleOnReportPress = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnUpgradePress = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnShowDetailsPress = () => {
    if (!isShowingDetails) {
      navigation.navigate("CardActions.OneTimePasswordModal", {
        redirect: "CardActions.CardDetailsScreen",
        cardType: cardType,
        action: "show-details",
      });
    }
    setIsShowingDetails(!isShowingDetails);
  };

  const handleOnCopyPress = () => {
    if (showBanner) {
      // hide the already shown banner to avoid duplicate banners
      setShowBanner(false);
    }
    Clipboard.setString(cardDetails.cardNumber);
    fetchCopiedText();
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    if (text.length > 0) {
      setShowErrorCopy(false);
    } else {
      setShowErrorCopy(true);
    }
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
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      response.Status === "freeze" ? setIsCardFrozen(true) : setShowErrorModal(true);
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async () => {
    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId });
      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
        navigation.navigate("CardActions.OneTimePasswordModal", {
          redirect: "CardActions.CardDetailsScreen",
          action: "unfreeze",
          otpId: response.OtpId,
          otpCode: response.OtpCode,
        });
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnViewPinPress = () => {
    setIsViewingPin(!isViewingPin);
  };

  const handleOnCloseNotification = () => {
    setShowNotificationAlert(false);
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleOnBackPress = () => {
    // if  from creation -> navigate to Home else goBack
    if (route.params.isCardCreated) {
      navigation.navigate("Temporary.LandingScreen");
    } else {
      navigation.goBack();
    }
  };

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["20p"],
  }));

  const walletButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const disabledIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          cardType === "standard"
            ? t("CardActions.CardDetailsScreen.navTitleStandard")
            : cardType === "plus"
            ? t("CardActions.CardDetailsScreen.navTitlePlus")
            : t("CardActions.CardDetailsScreen.navTitleSingleUse")
        }
        end={false}
        onBackPress={handleOnBackPress}
      />
      <DismissibleBanner
        isError={showErrorCopy}
        visible={showBanner}
        message={
          !showErrorCopy
            ? t("CardActions.CardDetailsScreen.copyClipboard")
            : t("CardActions.CardDetailsScreen.errorCopyClipboard")
        }
        icon={!showErrorCopy ? <CopyIcon /> : <ErrorOutlineIcon />}
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
            <BankCard.Active cardNumber="1234" cardType={cardType} />
          ) : (
            <BankCard.Unmasked
              cardNumber={cardDetails.cardNumber}
              cardType={cardType}
              cardDetails={{ endDate: cardDetails.endDate, securityCode: cardDetails.securityCode }}
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
        {cardType !== "single-use" && (
          <>
            {Platform.OS === "ios" && (
              <View style={walletButtonContainer}>
                <Button onPress={handleOnAddToAppleWallet}>Add to Apple Wallet</Button>
              </View>
            )}
            <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
              <ListItemLink
                icon={<CardSettingsIcon />}
                onPress={cardStatus === "active" ? handleOnActiveCardSettingsPress : handleOnInactiveCardSettingsPress}
                title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
              />
              <ListItemLink
                disabled={cardStatus === "inactive" ? true : false}
                icon={cardStatus === "inactive" ? <ReportIcon color={disabledIconColor} /> : <ReportIcon />}
                onPress={handleOnReportPress}
                title={t("CardActions.CardDetailsScreen.reportButton")}
              />
            </ListSection>
            <View style={separatorStyle} />
          </>
        )}
        <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
          <ListItemText title={t("CardActions.CardDetailsScreen.accountNumber")} value={cardDetails.cardNumber} />
          <ListItemText title={t("CardActions.CardDetailsScreen.accountName")} value={cardDetails.accountName} />
        </ListSection>
        {cardType === "standard" && (
          <>
            <View style={separatorStyle} />
            <View style={styles.upgradeContainer}>
              <UpgradeToCroatiaPlus onPress={handleOnUpgradePress} />
            </View>
          </>
        )}
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
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  upgradeContainer: {
    alignItems: "center",
  },
});

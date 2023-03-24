import Clipboard from "@react-native-clipboard/clipboard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, NativeEventSubscription, Platform, StyleSheet, View, ViewStyle } from "react-native";

import { CardSettingsIcon, CopyIcon, ReportIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton/AddToAppleWalletButton";
import BankCard from "@/components/BankCard";
import ContentContainer from "@/components/ContentContainer";
import DismissibleBanner from "@/components/DismissibleBanner";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { PHYSICAL_CARD_TYPE, SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import CardExpiryBanner from "../../components/CardExpiryBanner";
import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import ViewPinModal from "../../components/ViewPinModal";
import useOtpFlow from "../../hooks/use-otp";
import {
  useCard,
  useFreezeCard,
  useRequestViewPinOtp,
  useUnfreezeCard,
  useUnmaskedCardDetails,
} from "../../query-hooks";
import { DetailedCardResponse } from "../../types";
import CardButtons from "./CardButtons";
import ListItemText from "./ListItemText";
import SingleUseCardButtons from "./SingleUseCardButtons";
import UpgradeToCroatiaPlus from "./UpgradeToCroatiaPlus";

export default function CardDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const otpFlow = useOtpFlow();
  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();
  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const requestUnmaskedCardDetailsAsync = useUnmaskedCardDetails();
  const card = useCard(route.params.cardId);

  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();

  const [cardDetails, setCardDetails] = useState<DetailedCardResponse>();
  const [isSucCreatedAlertVisible, setIsSucCreatedAlertVisible] = useState(route.params?.isSingleUseCardCreated);
  const [isCopiedCardNumberBannerVisible, setIsCopiedCardNumberBannerVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const isExpiryCardNotification = false; //for testing expiry notification
  const selectedCard = card.data;
  const cardId = route.params.cardId;
  const cardStatus = selectedCard?.Status;

  useEffect(() => {
    setTimeout(() => setIsSucCreatedAlertVisible(route.params?.isSingleUseCardCreated), 500);
  }, [route.params]);

  useEffect(() => {
    const changeStateSubscription = AppState.addEventListener("change", nextAppstate => {
      if (nextAppstate !== "active") setCardDetails(undefined);
    });

    let blurStateSubscription: NativeEventSubscription | undefined;
    if (Platform.OS === "android") {
      blurStateSubscription = AppState.addEventListener("blur", nextAppState => {
        if (nextAppState !== "active") setCardDetails(undefined);
      });
    }

    const transitionBlurSubscription = navigation.addListener("blur", () => {
      setCardDetails(undefined);
    });

    return () => {
      changeStateSubscription.remove();
      blurStateSubscription?.remove();
      transitionBlurSubscription();
    };
  }, []);

  const handleOnAddToAppleWallet = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnCardSettingsPress = () => {
    navigation.navigate("CardActions.CardSettingsScreen", { cardId });
  };

  const handleOnReportPress = () => {
    navigation.navigate("CardActions.ReportCardScreen", { cardId });
  };

  const handleOnUpgradePress = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnShowDetailsPress = async () => {
    if (cardDetails !== undefined) return setCardDetails(undefined);

    try {
      const response = await requestUnmaskedCardDetailsAsync.mutateAsync({ cardId });

      otpFlow.handle<{ DetailedCardResponse: DetailedCardResponse }>({
        action: {
          to: "CardActions.CardDetailsScreen",
          params: {
            cardId,
          },
        },
        otpOptionalParams: {
          CardId: cardId,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: response.correlationId,
        },
        onOtpRequestResend: () => {
          return requestUnmaskedCardDetailsAsync.mutateAsync({ cardId });
        },
        onFinish: (status, payload) => {
          if (status === "success") {
            setCardDetails(payload.DetailedCardResponse);
          }
        },
      });
    } catch (error) {
      setCardDetails(undefined);
      setIsErrorModalVisible(true);

      warn("card-actions", "Could not show card details: ", JSON.stringify(error));
    }
  };

  const handleOnCopyCardNumberPress = () => {
    setIsCopiedCardNumberBannerVisible(false);
    if (cardDetails?.CardNumber === undefined) return;

    Clipboard.setString(cardDetails.CardNumber);
    setIsCopiedCardNumberBannerVisible(true);
    setTimeout(() => setIsCopiedCardNumberBannerVisible(false), 4000);
  };

  const handleOnPressActivate = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnFreezePress = () => {
    if (cardStatus === undefined) return;

    if (cardStatus === "unfreeze") {
      handleOnFreezeCardPress();
    } else {
      handleOnUnfreezeCardPress();
    }
  };

  const handleOnFreezeCardPress = async () => {
    const correlationId = generateRandomId();
    setCardDetails(undefined);

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from backend");
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async () => {
    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId });

      otpFlow.handle({
        action: {
          to: "CardActions.CardDetailsScreen",
          params: {
            cardId,
          },
        },
        otpOptionalParams: {
          CardId: cardId,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: response.correlationId,
        },
        onOtpRequestResend: () => {
          return unfreezeCardAsync.mutateAsync({ cardId });
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnCloseNotification = () => {
    setIsSucCreatedAlertVisible(false);
  };

  const handleOnBackPress = () => {
    if (route.params?.isSingleUseCardCreated) navigation.goBack();
    navigation.goBack();
  };

  const handleOnViewPinPress = async () => {
    try {
      const { correlationId, ...response } = await requestViewPinOtpAsync.mutateAsync({ cardId });

      otpFlow.handle<{ Pin: string }>({
        action: {
          to: "CardActions.CardDetailsScreen",
          params: {
            cardId,
          },
        },
        otpOptionalParams: {
          CardId: cardId,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          correlationId: correlationId,
        },
        onFinish: (status, payload) => {
          if (status === "fail" || payload === undefined) return;

          setPin(payload.Pin as string);
          // Add delay or else modal will be blocked from becoming visible
          setTimeout(() => setIsViewingPin(true), 500);
        },
        onOtpRequestResend: () => {
          return requestViewPinOtpAsync.mutateAsync({ cardId });
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
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

  const expiryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
  }));

  return (
    <>
      <DismissibleBanner
        visible={isCopiedCardNumberBannerVisible}
        message={t("CardActions.CardDetailsScreen.copyClipboard")}
        icon={<CopyIcon />}
        variant="default"
      />
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={
            selectedCard?.CardType === SINGLE_USE_CARD_TYPE
              ? t("CardActions.CardDetailsScreen.navTitleSingleUse")
              : selectedCard?.ProductId === STANDARD_CARD_PRODUCT_ID
              ? t("CardActions.CardDetailsScreen.navTitleStandard")
              : t("CardActions.CardDetailsScreen.navTitlePlus")
          }
          onBackPress={handleOnBackPress}
        />
        {isExpiryCardNotification &&
        selectedCard?.CardType === PHYSICAL_CARD_TYPE &&
        selectedCard?.Status === "unfreeze" ? (
          <View style={expiryContainerStyle}>
            <CardExpiryBanner />
          </View>
        ) : null}
        <ContentContainer isScrollView>
          <View style={cardContainerStyle}>
            {cardStatus === "freeze" && cardDetails === undefined && selectedCard?.CardType !== SINGLE_USE_CARD_TYPE ? (
              <BankCard.Inactive
                status="freeze"
                actionButton={<BankCard.ActionButton title={t("CardActions.cardFrozen")} type="dark" />}
              />
            ) : cardStatus === "inactive" && selectedCard?.CardType !== SINGLE_USE_CARD_TYPE ? (
              <BankCard.Inactive
                status="inactive"
                label={t("CardActions.CardDetailsScreen.inactiveCard.label")}
                actionButton={
                  <BankCard.ActionButton
                    type="light"
                    title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                    onPress={handleOnPressActivate}
                  />
                }
              />
            ) : cardDetails === undefined ? (
              <BankCard.Active
                cardNumber={selectedCard?.LastFourDigits}
                cardType={selectedCard?.CardType}
                productId={selectedCard?.ProductId}
                isExpiringSoon={
                  isExpiryCardNotification &&
                  selectedCard?.CardType === PHYSICAL_CARD_TYPE &&
                  selectedCard?.Status === "unfreeze"
                }
              />
            ) : (
              <BankCard.Unmasked
                cardNumber={cardDetails.CardNumber}
                cardType={selectedCard?.CardType}
                cardDetails={{ endDate: cardDetails.ExpDate, securityCode: cardDetails.Cvv }}
                onCopyPress={handleOnCopyCardNumberPress}
                productId={selectedCard?.ProductId}
                cardStatus={selectedCard?.Status}
              />
            )}
          </View>
          {selectedCard?.CardType === SINGLE_USE_CARD_TYPE ? (
            <SingleUseCardButtons
              onShowDetailsPress={handleOnShowDetailsPress}
              isShowingDetails={cardDetails !== undefined}
            />
          ) : cardStatus !== "inactive" ? (
            <CardButtons
              isViewingPin={isViewingPin}
              isCardFrozen={cardStatus === "freeze"}
              onShowDetailsPress={handleOnShowDetailsPress}
              onViewPinPress={handleOnViewPinPress}
              onFreezePress={handleOnFreezePress}
              isShowingDetails={cardDetails !== undefined}
            />
          ) : (
            <View />
          )}
          <View style={separatorStyle} />
          {selectedCard?.CardType !== SINGLE_USE_CARD_TYPE ? (
            <>
              {Platform.OS === "ios" ? (
                <View style={walletButtonContainer}>
                  <AddToAppleWalletButton onPress={handleOnAddToAppleWallet} />
                </View>
              ) : (
                <View />
              )}
              <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
                <ListItemLink
                  disabled={cardStatus === "freeze"}
                  icon={<CardSettingsIcon />}
                  onPress={handleOnCardSettingsPress}
                  title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
                />
                <ListItemLink
                  disabled={cardStatus !== "unfreeze"}
                  icon={<ReportIcon />}
                  onPress={handleOnReportPress}
                  title={t("CardActions.CardDetailsScreen.reportButton")}
                />
              </ListSection>
              <View style={separatorStyle} />
            </>
          ) : (
            <View />
          )}
          <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
            {selectedCard?.AccountName ? (
              <ListItemText title={t("CardActions.CardDetailsScreen.accountName")} value={selectedCard?.AccountName} />
            ) : null}
            {selectedCard?.AccountNumber ? (
              <ListItemText
                title={t("CardActions.CardDetailsScreen.accountNumber")}
                value={selectedCard?.AccountNumber}
              />
            ) : null}
          </ListSection>
          {selectedCard?.ProductId === STANDARD_CARD_PRODUCT_ID && selectedCard?.CardType !== SINGLE_USE_CARD_TYPE ? (
            <>
              <View style={separatorStyle} />
              <View style={styles.upgradeContainer}>
                <UpgradeToCroatiaPlus onPress={handleOnUpgradePress} />
              </View>
            </>
          ) : (
            <View />
          )}
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="success"
        onClose={handleOnCloseNotification}
        message={t("CardActions.SingleUseCard.CardCreation.successMessage")}
        title={t("CardActions.SingleUseCard.CardCreation.successTitle")}
        isVisible={isSucCreatedAlertVisible}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      {pin !== undefined ? (
        <ViewPinModal pin={pin} visible={isViewingPin} onClose={() => setIsViewingPin(false)} />
      ) : (
        <View />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  upgradeContainer: {
    alignItems: "center",
  },
});

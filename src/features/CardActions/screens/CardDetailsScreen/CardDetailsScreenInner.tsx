import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, NativeEventSubscription, Platform, StyleSheet, View, ViewStyle } from "react-native";

import { CardSettingsIcon, ReportIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  CardButtons,
  ListItemLink,
  ListItemText,
  ListSection,
  MadaPayBanner,
  SingleUseCardButtons,
  UpgradeToCroatiaPlus,
  ViewPinModal,
} from "../../components";
import { isSingleUseCard } from "../../helpers";
import {
  useChangeCardStatus,
  useFreezeCard,
  useRequestViewPinOtp,
  useUnmaskedCardDetails,
} from "../../hooks/query-hooks";
import useAppleWallet from "../../hooks/use-apple-wallet";
import { Card, DetailedCardResponse } from "../../types";
import BankCardHeader from "./BankCardHeader";
import TopBanner from "./TopBanner";

interface CardDetailsScreenInnerProps {
  card: Card;
  onError: () => void;
  isSingleUseCardCreated?: boolean;
}

export default function CardDetailsScreenInner({ card, onError, isSingleUseCardCreated }: CardDetailsScreenInnerProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const freezeCardAsync = useFreezeCard();
  const changeCardStatusAsync = useChangeCardStatus();
  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const requestUnmaskedCardDetailsAsync = useUnmaskedCardDetails();
  const { isAppleWalletAvailable, canAddCardToAppleWallet, addCardToAppleWallet } = useAppleWallet(card.CardId);

  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [cardDetails, setCardDetails] = useState<DetailedCardResponse>();
  const [isNotificationBannerVisible, setIsNotificationBannerVisible] = useState(true);
  const [isSucCreatedAlertVisible, setIsSucCreatedAlertVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsSucCreatedAlertVisible(isSingleUseCardCreated ?? false), 500);
  }, [isSingleUseCardCreated]);

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
  }, [navigation]);

  const handleOnAddToAppleWallet = async () => {
    if (!isAppleWalletAvailable || !canAddCardToAppleWallet) return;

    try {
      await addCardToAppleWallet();
      navigation.navigate("CardActions.ApplePayActivated");
    } catch (error) {
      warn("card-actions", "Could not add payment card to Apple Wallet: ", JSON.stringify(error));
    }
  };

  const handleOnCardSettingsPress = () => {
    navigation.navigate("CardActions.CardSettingsScreen", { cardId: card.CardId });
  };

  const handleOnReportPress = () => {
    navigation.navigate("CardActions.ReportCardScreen", {
      cardId: card.CardId,
      cardStatus: card.Status,
    });
  };

  const handleOnUpgradePress = () => {
    navigation.navigate("Temporary.DummyScreen");
  };

  const handleOnShowDetailsPress = async () => {
    if (cardDetails !== undefined) {
      return setCardDetails(undefined);
    }

    otpFlow.handle({
      action: {
        to: "CardActions.CardDetailsScreen",
        params: {
          cardId: card.CardId,
        },
      },
      otpOptionalParams: {
        CardId: card.CardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return requestUnmaskedCardDetailsAsync.mutateAsync({ cardId: card.CardId });
      },
      onFinish: (status, payload: { DetailedCardResponse: DetailedCardResponse }) => {
        if (status === "cancel") {
          return;
        }

        if (status === "fail" || payload.DetailedCardResponse === undefined) {
          setCardDetails(undefined);
          setTimeout(() => onError(), 500);

          return;
        }

        if (status === "success") {
          setCardDetails(payload.DetailedCardResponse);
        }
      },
    });
  };

  const handleOnPressActivate = () => {
    navigation.navigate("CardActions.EnterCardCVVScreen", {
      cardId: card.CardId,
    });
  };

  const handleOnFreezePress = () => {
    if (card.Status === "unfreeze") {
      handleOnFreezeCardPress();
    } else {
      handleOnUnfreezeCardPress();
    }
  };

  const handleOnFreezeCardPress = async () => {
    setCardDetails(undefined);

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId: card.CardId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from backend");
    } catch (error) {
      onError();
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async () => {
    otpFlow.handle({
      action: {
        to: "CardActions.CardDetailsScreen",
        params: { cardId: card.CardId },
      },
      otpOptionalParams: {
        CardId: card.CardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return changeCardStatusAsync.mutateAsync({ cardId: card.CardId, status: "unfreeze" });
      },
      onFinish: status => {
        if (status === "fail") {
          onError();
        }
      },
    });
  };

  const handleOnViewPinPress = async () => {
    otpFlow.handle({
      action: {
        to: "CardActions.CardDetailsScreen",
        params: { cardId: card.CardId },
      },
      otpOptionalParams: {
        CardId: card.CardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return requestViewPinOtpAsync.mutateAsync({ cardId: card.CardId });
      },
      onFinish: (status, payload: { Pin: string }) => {
        if (status === "fail" || status === "cancel" || payload === undefined) return;

        setPin(payload.Pin as string);
        // Add delay or else modal will be blocked from becoming visible
        setTimeout(() => setIsViewingPin(true), 500);
      },
    });
  };

  const handleOnRenewCardPress = () => {
    if (card === undefined) return;

    navigation.navigate("CardActions.ApplyCardScreen", {
      replacingCardId: card.CardId,
      productId: card.ProductId,
    });
  };

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

  return (
    <>
      <ContentContainer isScrollView>
        <TopBanner
          card={card}
          onClose={() => setIsNotificationBannerVisible(false)}
          onRenewPress={handleOnRenewCardPress}
          isVisible={isNotificationBannerVisible}
        />
        <BankCardHeader card={card} cardDetails={cardDetails} onActivatePress={handleOnPressActivate} />
        {isSingleUseCard(card) ? (
          <SingleUseCardButtons
            onShowDetailsPress={handleOnShowDetailsPress}
            isShowingDetails={cardDetails !== undefined}
          />
        ) : card.Status !== "inactive" ? (
          <CardButtons
            isViewingPin={isViewingPin}
            isCardFrozen={card.Status === "freeze"}
            isFreezeButtonVisible={card.Status !== "pending-activation"}
            isViewPinButtonVisible={card.Status !== "pending-activation"}
            onShowDetailsPress={handleOnShowDetailsPress}
            onViewPinPress={handleOnViewPinPress}
            onFreezePress={handleOnFreezePress}
            isShowingDetails={cardDetails !== undefined}
            isDisablePin={card.Status === "pending-activation"}
          />
        ) : null}
        <View style={separatorStyle} />
        {!isSingleUseCard(card) ? (
          <>
            {isAppleWalletAvailable && canAddCardToAppleWallet && !["freeze", "inactive"].includes(card.Status) ? (
              <View style={walletButtonContainer}>
                <AddToAppleWalletButton onPress={handleOnAddToAppleWallet} />
              </View>
            ) : null}
            {Platform.OS === "android" && !["freeze", "inactive"].includes(card.Status) ? (
              <>
                <MadaPayBanner />
                <View style={separatorStyle} />
              </>
            ) : null}
            <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
              <ListItemLink
                disabled={["freeze", "inactive"].includes(card.Status)}
                icon={<CardSettingsIcon />}
                onPress={handleOnCardSettingsPress}
                title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
              />
              <ListItemLink
                icon={<ReportIcon />}
                onPress={handleOnReportPress}
                title={t("CardActions.CardDetailsScreen.reportButton")}
                disabled={card.Status === "pending-activation"}
              />
            </ListSection>
            <View style={separatorStyle} />
          </>
        ) : null}
        <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
          <ListItemText title={t("CardActions.CardDetailsScreen.accountName")} value={card.AccountName} />
          <ListItemText title={t("CardActions.CardDetailsScreen.accountNumber")} value={card.AccountNumber} />
        </ListSection>
        {card.ProductId === STANDARD_CARD_PRODUCT_ID && !isSingleUseCard(card) ? (
          <>
            <View style={separatorStyle} />
            <View style={styles.upgradeContainer}>
              <UpgradeToCroatiaPlus onPress={handleOnUpgradePress} />
            </View>
          </>
        ) : null}
      </ContentContainer>
      <NotificationModal
        variant="success"
        onClose={() => setIsSucCreatedAlertVisible(false)}
        message={t("CardActions.SingleUseCard.CardCreation.successMessage")}
        title={t("CardActions.SingleUseCard.CardCreation.successTitle")}
        isVisible={isSucCreatedAlertVisible}
      />
      {pin !== undefined ? (
        <ViewPinModal pin={pin} visible={isViewingPin} onClose={() => setIsViewingPin(false)} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  upgradeContainer: {
    alignItems: "center",
  },
});

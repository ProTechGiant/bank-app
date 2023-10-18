import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, NativeEventSubscription, Platform, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import { CardIcon, CardSettingsIcon, InfoFilledCircleIcon, ReportIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NotificationModal from "@/components/NotificationModal";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import {
  CardButtons,
  InlineBanner,
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

interface CardDetailsScreenInnerProps {
  card: Card;
  onError: () => void;
  isSingleUseCardCreated?: boolean;
}

export default function CardDetailsScreenInner({ card, onError, isSingleUseCardCreated }: CardDetailsScreenInnerProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const otpFlow = useOtpFlow<AuthenticatedStackParams>();
  const { mutateAsync: freezeCardAsync, isLoading: freezeLoading } = useFreezeCard();
  const { mutateAsync: changeCardStatusAsync, isLoading: changeStatusLoading } = useChangeCardStatus();
  const requestViewPinOtpAsync = useRequestViewPinOtp();
  const requestUnmaskedCardDetailsAsync = useUnmaskedCardDetails();
  const { isAppleWalletAvailable, canAddCardToAppleWallet, addCardToAppleWallet } = useAppleWallet(card.CardId);

  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [cardDetails, setCardDetails] = useState<DetailedCardResponse>();
  const [isNotificationBannerVisible, setIsNotificationBannerVisible] = useState(true);
  const [isSucCreatedAlertVisible, setIsSucCreatedAlertVisible] = useState(false);
  const [isLockConfirmModalVisible, setIsLockConfirmModalVisible] = useState(false);
  const [isUnlockConfirmModalVisible, setIsUnlockConfirmModalVisible] = useState(false);
  const [isApplyPhysicalCardModalVisible, setIsApplyPhysicalCardModalVisible] = useState(false);
  const [isLockedSuccess, setIsLockedSuccess] = useState(false);
  const [isUnLockedSuccess, setIsUnLockedSuccess] = useState(false);

  const [isWaitPeriodModalVisible, setIsWaitPeriodModalVisible] = useState(false);

  useEffect(() => {
    delayTransition(() => setIsSucCreatedAlertVisible(isSingleUseCardCreated ?? false));
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

  const handleIVRService = () => {
    navigation.navigate("CardActions.WaitingVerificationCard", {
      title: t("CardActions.WaitingVerificationCard.waitingVerificationTitle"),
      message: t("CardActions.WaitingVerificationCard.waitingVerificationMessage"),
      cardId: card.CardId,
      callback: handleOnAddToAppleWallet,
    });
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

  const handleOnRequestPhysicalCard = () => {
    setIsApplyPhysicalCardModalVisible(true);
  };

  const handleOnRequestPhysicalCardConfirmPress = () => {
    setIsApplyPhysicalCardModalVisible(false);
    navigation.navigate("CardActions.ConfirmCardDeliveryAddress", {
      cardId: card.CardId,
      cardType: card.CardType,
      cardHolderName: card.AccountName,
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
          delayTransition(() => onError());

          return;
        }

        if (status === "success") {
          setCardDetails(payload.DetailedCardResponse);
        }
      },
    });
  };

  const handleOnPressActivate = () => {
    navigation.navigate("CardActions.SetPinScreen", {
      cardId: card.CardId,
    });
  };

  const handleOnFreezePress = () => {
    if (card.Status === "UNLOCK") {
      setIsLockConfirmModalVisible(true);
    } else {
      setIsUnlockConfirmModalVisible(true);
    }
  };

  const handleOnOk = () => {
    setIsLockedSuccess(false);
    navigation.goBack();
  };

  const handleOnUnLockedSuccess = () => {
    setIsUnLockedSuccess(false);
    navigation.goBack();
  };

  const handleOnFreezeCardPress = async () => {
    setCardDetails(undefined);
    setIsLockConfirmModalVisible(false);

    try {
      const response = await freezeCardAsync({ cardId: card.CardId });
      if (response.Status !== "LOCK") {
        setIsLockedSuccess(false);
        throw new Error("Received unexpected response from back-end");
      } else {
        setIsLockedSuccess(true);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_CARD_STATUS_WAIT_PERIOD)) {
          setIsWaitPeriodModalVisible(true);
        } else {
          onError();
          warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
        }
      }
    }
  };

  const handleOnUnfreezeCardPress = () => {
    setIsUnlockConfirmModalVisible(false);
    delayTransition(otpValidation);
  };

  const otpValidation = async () => {
    try {
      await changeCardStatusAsync({ cardId: card.CardId, status: "UNLOCK" });

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
          return changeCardStatusAsync({ cardId: card.CardId, status: "UNLOCK" });
        },
        onFinish: status => {
          if (status === "success") {
            setIsUnLockedSuccess(true);
          } else {
            onError();
          }
        },
      });
    } catch (error) {
      if (error instanceof ApiError && error.errorContent.Message.includes(ERROR_CARD_STATUS_WAIT_PERIOD)) {
        setIsWaitPeriodModalVisible(true);
      }
    }
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

        setPin(payload.Pin);
        delayTransition(() => setIsViewingPin(true));
      },
    });
  };

  const handleOnRenewCardPress = () => {
    if (card === undefined) return;

    navigation.navigate("CardActions.RenewCardScreen", {
      cardId: card.CardId,
    });
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 3,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const inlineBannerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["12p"],
  }));

  const upgradeContainer = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginTop: theme.spacing["16p"],
  }));

  const walletButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <>
      <ContentContainer isScrollView>
        <BankCardHeader
          card={card}
          cardDetails={cardDetails}
          onActivatePress={handleOnPressActivate}
          onRenewCardPress={handleOnRenewCardPress}
        />
        {isSingleUseCard(card) ? (
          <SingleUseCardButtons
            onShowDetailsPress={handleOnShowDetailsPress}
            isShowingDetails={cardDetails !== undefined}
          />
        ) : card.Status !== "INACTIVE" ? (
          <CardButtons
            isViewingPin={isViewingPin}
            isCardFrozen={card.Status === "LOCK"}
            isFreezeButtonVisible={card.Status !== "NEW_CARD"}
            isViewPinButtonVisible={card.Status !== "NEW_CARD"}
            onShowDetailsPress={handleOnShowDetailsPress}
            onViewPinPress={handleOnViewPinPress}
            onFreezePress={handleOnFreezePress}
            isShowingDetails={cardDetails !== undefined}
            isDisablePin={card.Status === "NEW_CARD"}
            cardStatus={card.Status}
          />
        ) : null}
        {isNotificationBannerVisible && card.IsExpireSoon ? (
          <View style={inlineBannerContainerStyle}>
            <InlineBanner
              icon={<InfoFilledCircleIcon />}
              text={t("CardActions.CardExpiryNotification.content")}
              onClose={() => setIsNotificationBannerVisible(false)}
              testID="CardActions.CardDetailsScreen:ExpiringSoonBanner"
            />
          </View>
        ) : null}
        <View style={separatorStyle} />
        {!isSingleUseCard(card) ? (
          <>
            {isAppleWalletAvailable && canAddCardToAppleWallet && !["LOCK", "INACTIVE"].includes(card.Status) ? (
              <View style={walletButtonContainer}>
                <AddToAppleWalletButton
                  onPress={handleIVRService}
                  testID="CardActions.CardDetailsScreen:AddToAppleWalletButton"
                />
              </View>
            ) : null}
            {Platform.OS === "android" && !["LOCK", "INACTIVE", "NEW_CARD"].includes(card.Status) ? (
              <>
                <MadaPayBanner testID="CardActions.CardDetailsScreen:MadaPaybanner" />
                <View style={separatorStyle} />
              </>
            ) : null}
            <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
              <ListItemLink
                disabled={["LOCK", "INACTIVE", "NEW_CARD", "CANCELLED"].includes(card.Status)}
                icon={<CardSettingsIcon />}
                onPress={handleOnCardSettingsPress}
                title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
                testID="CardActions.CardDetailsScreen:CardSettingsButton"
              />
              <ListItemLink
                icon={<ReportIcon />}
                onPress={handleOnReportPress}
                title={t("CardActions.CardDetailsScreen.reportButton")}
                disabled={card.Status === "NEW_CARD" || card.Status === "CANCELLED"}
                testID="CardActions.CardDetailsScreen:ReportCardButton"
              />
              <ListItemLink
                icon={<CardIcon />}
                onPress={handleOnRequestPhysicalCard}
                title={t("CardActions.CardDetailsScreen.requestPhysicalCard")}
                disabled={card.Status === "PENDING-ACTIVATION"}
                testID="CardActions.CardDetailsScreen:RequestPhysicalCardButton"
              />
            </ListSection>
            <View style={separatorStyle} />
          </>
        ) : null}
        <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
          <ListItemText
            title={t("CardActions.CardDetailsScreen.accountName")}
            value={card.AccountName}
            testID="CardActions.CardDetailsScreen:AccountName"
          />
          <ListItemText
            title={t("CardActions.CardDetailsScreen.accountNumber")}
            value={card.AccountNumber}
            testID="CardActions.CardDetailsScreen:AccountNumber"
          />
        </ListSection>
        {card.ProductId === STANDARD_CARD_PRODUCT_ID && !isSingleUseCard(card) ? (
          <>
            <View style={upgradeContainer}>
              <UpgradeToCroatiaPlus
                onPress={handleOnUpgradePress}
                testID="CardActions.CardDetailsScreen:UpgradeToPlusButton"
              />
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
        testID="CardActions.CardDetailsScreen:SingleUseCardCreatedModal"
      />
      {pin !== undefined ? (
        <ViewPinModal
          pin={pin}
          visible={isViewingPin}
          onClose={() => setIsViewingPin(false)}
          testID="CardActions.CardDetailsScreen:ViewPinModal"
        />
      ) : null}
      {/* Lock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              loading={freezeLoading}
              disabled={freezeLoading}
              onPress={handleOnFreezeCardPress}
              testID="CardActions.CardDetailsScreen:CardLockedModalConfirmButton">
              {t("CardActions.CardDetailsScreen.lockConfirmationModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsLockConfirmModalVisible(false)}
              testID="CardActions.CardDetailsScreen:CardLockedModalCancelButton">
              {t("CardActions.CardDetailsScreen.lockConfirmationModal.cancelButton")}
            </Button>
          ),
        }}
        message={t("CardActions.CardDetailsScreen.lockConfirmationModal.message")}
        title={t("CardActions.CardDetailsScreen.lockConfirmationModal.title")}
        isVisible={isLockConfirmModalVisible}
        onClose={() => {
          setIsLockConfirmModalVisible(false);
        }}
        testID="CardActions.CardDetailsScreen:CardLockedModal"
      />
      {/* Unlock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              loading={changeStatusLoading}
              disabled={changeStatusLoading}
              onPress={handleOnUnfreezeCardPress}
              testID="CardActions.CardDetailsScreen:CardUnlockedModalConfirmButton">
              {t("CardActions.CardDetailsScreen.unlockConfirmationModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsUnlockConfirmModalVisible(false)}
              testID="CardActions.CardDetailsScreen:CardUnlockedModalCancelButton">
              {t("CardActions.CardDetailsScreen.unlockConfirmationModal.cancelButton")}
            </Button>
          ),
        }}
        message=""
        title={t("CardActions.CardDetailsScreen.unlockConfirmationModal.title")}
        isVisible={isUnlockConfirmModalVisible}
        onClose={() => {
          setIsUnlockConfirmModalVisible(false);
        }}
        testID="CardActions.CardDetailsScreen:CardUnlockedModal"
      />
      {/* Card status change wait period notification modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={() => setIsWaitPeriodModalVisible(false)}>
              {t("CardActions.CardDetailsScreen.waitPeriodModal.okButton")}
            </Button>
          ),
        }}
        message={t("CardActions.CardDetailsScreen.waitPeriodModal.message")}
        title={t("CardActions.CardDetailsScreen.waitPeriodModal.title", {
          cardState:
            card.Status === "LOCK"
              ? t("CardActions.CardDetailsScreen.waitPeriodModal.unlockState")
              : t("CardActions.CardDetailsScreen.waitPeriodModal.lockState"),
        })}
        isVisible={isWaitPeriodModalVisible}
        testID="CardActions.CardDetailsScreen:CardStatusChangeWaitModal"
      />

      {/* Apply for PhysicalCard confirmation modal */}
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

      <NotificationModal
        variant="success"
        title={t("CardActions.CardDetailsScreen.lockSuccessFullModal.title")}
        isVisible={isLockedSuccess}
        buttons={{
          primary: (
            <Button onPress={handleOnOk} testID="CardActions.CardDetailsScreen:LockSuccessfulModalOkButton">
              {t("CardActions.CardDetailsScreen.lockSuccessFullModal.okButton")}
            </Button>
          ),
        }}
        testID="CardActions.CardDetailsScreen:LockSuccessfulModal"
      />

      <NotificationModal
        variant="success"
        title={t("CardActions.CardDetailsScreen.unLockSuccessFullModal.title")}
        isVisible={isUnLockedSuccess}
        buttons={{
          primary: (
            <Button
              onPress={handleOnUnLockedSuccess}
              testID="CardActions.CardDetailsScreen:UnlockSuccessfulModalOkButton">
              {t("CardActions.CardDetailsScreen.unLockSuccessFullModal.okButton")}
            </Button>
          ),
        }}
        testID="CardActions.CardDetailsScreen:UnlockSuccessfulModal"
      />
    </>
  );
}

const ERROR_CARD_STATUS_WAIT_PERIOD = "Cannot Update State Until 5 Minutes Pass";

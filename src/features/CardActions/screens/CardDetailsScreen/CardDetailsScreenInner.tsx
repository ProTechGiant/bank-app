import { deviceSupportsAppleWallet } from "fooapplewalletreactplugin";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, NativeEventSubscription, Platform, StyleSheet, View, ViewStyle } from "react-native";
import WatchConnectivity from "react-native-watch-connectivity";

import ApiError from "@/api/ApiError";
import { CardIcon, CardSettingsIcon, ClockIcon, InfoFilledCircleIcon, ReportIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import NotificationModal from "@/components/NotificationModal";
import { STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useGetCardDetails } from "@/hooks/niSDK/niHooks/use-get-card-details";
import { useGetToken } from "@/hooks/use-token";
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
} from "../../components";
import { NI_ROOT_URL } from "../../constants";
import { isSingleUseCard } from "../../helpers";
import { useChangeCardStatus, useFreezeCard } from "../../hooks/query-hooks";
import { Card, DetailedCardResponse, NIInputInterface } from "../../types";
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
  const [isAppleWatchPaired, setIsAppleWatchPaired] = useState(false);
  const { isLoading, onGetCardDetails, result: niCardDetailsResult, error: niCardDetailsError } = useGetCardDetails();

  const { mutateAsync: getNITokenAsync } = useGetToken();

  const [cardDetails, setCardDetails] = useState<DetailedCardResponse>();

  const [cardDetailsHideCountSeconds, setcardDetailsHideCountSeconds] = useState<number>(0);
  const [isNotificationBannerVisible, setIsNotificationBannerVisible] = useState(true);
  const [isSubmitErrorVisible, setIsSubmitErrorVisible] = useState(false);
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
    checkAppleWatchPairing();
  }, []);

  useEffect(() => {
    if (cardDetailsHideCountSeconds <= 0) {
      setCardDetails(undefined);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (cardDetailsHideCountSeconds > 0) {
        setcardDetailsHideCountSeconds(current => current - 1);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cardDetailsHideCountSeconds]);

  useEffect(() => {
    if (niCardDetailsError !== null) {
      setIsSubmitErrorVisible(true);
    }
  }, [niCardDetailsError]);

  useEffect(() => {
    if (niCardDetailsResult) {
      const { clearCVV2, expiry, clearPan, cardholderName } = niCardDetailsResult;
      setcardDetailsHideCountSeconds(CARD_DETAILS_COUNT_SECONDS);
      setCardDetails({
        Cvv: clearCVV2,
        ExpDate: expiry,
        CardNumber: clearPan,
        CardholderName: cardholderName,
      });
    }
  }, [niCardDetailsResult]);

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

  const handleOnAddToAppleWallet = () => {
    navigation.navigate("CardActions.CardToWalletScreen", {
      cardId: card.CardId,
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

  const checkAppleWatchPairing = async () => {
    try {
      const isConnected = await WatchConnectivity.getIsWatchAppInstalled();
      setIsAppleWatchPaired(isConnected);
    } catch (error) {
      warn("Unable to get apple watch pairing status:", error + "");
    }
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

  const handleVerificationSuccess = async () => {
    try {
      const res = await getNITokenAsync();
      if (res) {
        const niInput: NIInputInterface = {
          cardIdentifierType: "EXID",
          cardIdentifierId: card.CardId,
          bankCode: "CROAT",
          connectionProperties: {
            rootUrl: NI_ROOT_URL,
            token: res.AccessToken,
          },
        };
        onGetCardDetails(niInput);
      }
    } catch (error) {
      warn("CARD-ACTIONS", `Error while getting token: ${JSON.stringify(error)}`);
      setIsSubmitErrorVisible(true);
    }
  };

  const handleOnShowDetailsPress = async () => {
    if (cardDetails !== undefined) {
      return setcardDetailsHideCountSeconds(0);
    }

    navigation.navigate("CardActions.VerifyPinScreen", {
      title: t("CardActions.VerifyPinScreen.verifyPinScreenTitle"),
      message: t("CardActions.VerifyPinScreen.verifyPinScreenMessage"),
      onVerificationComplete: () => handleVerificationSuccess(),
      cardId: card.CardId,
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
  };

  const handleOnUnLockedSuccess = () => {
    setIsUnLockedSuccess(false);
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
      const response = await changeCardStatusAsync({ cardId: card.CardId, status: "UNLOCK" });
      otpFlow.handle({
        action: {
          to: "CardActions.CardDetailsScreen",
          params: { cardId: card.CardId },
        },
        otpOptionalParams: {
          CardId: card.CardId,
          isOtpAlreadySent: true,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          PhoneNumber: response.PhoneNumber,
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

  const handleOnCloseError = () => {
    setIsSubmitErrorVisible(false);
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
    marginVertical: theme.spacing["24p"],
  }));
  const cardDetailsBannerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
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
      {isLoading ? (
        <FullScreenLoader />
      ) : (
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
              isCardFrozen={card.Status === "LOCK"}
              isFreezeButtonVisible={card.Status !== "NEW_CARD"}
              onShowDetailsPress={handleOnShowDetailsPress}
              onFreezePress={handleOnFreezePress}
              isShowingDetails={cardDetails !== undefined}
              cardStatus={card.Status}
            />
          ) : null}
          {cardDetails !== undefined ? (
            <View style={cardDetailsBannerContainerStyle}>
              <InlineBanner
                style={styles.cardDetailsBannerContainer}
                icon={<ClockIcon />}
                text={t("CardActions.CardDetailsScreen.cardDetailsShowTime", {
                  minutes: Math.floor(cardDetailsHideCountSeconds / 60),
                  seconds: String(cardDetailsHideCountSeconds % 60).padStart(2, "0"),
                })}
                testID="CardActions.CardDetailsScreen:ExpiringSoonBanner"
              />
            </View>
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
              {deviceSupportsAppleWallet() && !isAppleWatchPaired && !["LOCK", "INACTIVE"].includes(card.Status) ? (
                /* isAppleWatchPaired condition is placed temporory, will be merged and used once the remote card method is available from NI wallet SDK
                 */
                <View style={walletButtonContainer}>
                  <AddToAppleWalletButton
                    onPress={handleOnAddToAppleWallet}
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
                  disabled={["INACTIVE", "NEW_CARD", "CANCELLED"].includes(card.Status)}
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
      )}

      <NotificationModal
        variant="success"
        onClose={() => setIsSucCreatedAlertVisible(false)}
        message={t("CardActions.SingleUseCard.CardCreation.successMessage")}
        title={t("CardActions.SingleUseCard.CardCreation.successTitle")}
        isVisible={isSucCreatedAlertVisible}
        testID="CardActions.CardDetailsScreen:SingleUseCardCreatedModal"
      />

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

      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isSubmitErrorVisible}
        onClose={handleOnCloseError}
      />
    </>
  );
}

const ERROR_CARD_STATUS_WAIT_PERIOD = "Cannot Update State Until 5 Minutes Pass";
const CARD_DETAILS_COUNT_SECONDS = 120;

const styles = StyleSheet.create({
  cardDetailsBannerContainer: {
    justifyContent: "flex-start",
  },
});

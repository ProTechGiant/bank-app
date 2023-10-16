import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import delayTransition from "@/utils/delay-transition";

import { CardList, ViewPinModal } from "../components";
import { useCards, useChangeCardStatus, useFreezeCard, useRequestViewPinOtp } from "../hooks/query-hooks";
import { CardStatus } from "../types";

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const cardsQuery = useCards();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();

  const { mutateAsync: freezeCardAsync, isLoading: freezeLoading } = useFreezeCard();
  const { mutateAsync: changeCardStatusAsync } = useChangeCardStatus();
  const requestViewPinOtpAsync = useRequestViewPinOtp();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const [isLockConfirmModalVisible, setIsLockConfirmModalVisible] = useState(false);
  const [isUnlockConfirmModalVisible, setIsUnlockConfirmModalVisible] = useState(false);
  const [isLockedSuccess, setIsLockedSuccess] = useState(false);
  const [isUnLockedSuccess, setIsUnLockedSuccess] = useState(false);
  const [isWaitPeriodModalVisible, setIsWaitPeriodModalVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [selectedCardStatus, setSelectedCardStatus] = useState<CardStatus>();

  // display error if api failed to get response.
  useEffect(() => {
    setIsLoadingErrorVisible(cardsQuery.isError);
  }, [cardsQuery.isError]);

  const handleOnFreezeCardConfirmation = async () => {
    try {
      const response = await freezeCardAsync({ cardId: selectedCardId });
      if (response.Status !== "LOCK") {
        throw new Error("Received unexpected response from back-end");
      } else {
        delayTransition(() => {
          setIsLockedSuccess(true);
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_CARD_STATUS_WAIT_PERIOD)) {
          delayTransition(() => {
            setIsWaitPeriodModalVisible(true);
          });
        } else {
          delayTransition(() => {
            setShowErrorModal(true);
          });
          warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
        }
      }
    } finally {
      setIsLockConfirmModalVisible(false);
    }
  };

  const handleOnUnfreezeCardConfirmation = () => {
    setIsUnlockConfirmModalVisible(false);
    delayTransition(otpValidation);
  };

  const otpValidation = async () => {
    otpFlow.handle({
      action: {
        to: "CardActions.HomeScreen",
      },
      otpOptionalParams: {
        CardId: selectedCardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: async () => {
        return changeCardStatusAsync({ cardId: selectedCardId, status: "UNLOCK" });
      },
      onFinish: status => {
        if (status === "fail") {
          setShowErrorModal(true);
        } else {
          setIsUnLockedSuccess(true);
          cardsQuery.refetch();
        }
      },
    });
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleOnViewPinPress = async (cardId: string) => {
    otpFlow.handle<{ Pin: string }>({
      action: {
        to: "CardActions.HomeScreen",
      },
      otpOptionalParams: {
        CardId: cardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return requestViewPinOtpAsync.mutateAsync({ cardId });
      },
      onFinish: (status, payload) => {
        if (status === "fail" || status === "cancel" || undefined === payload) return;

        setPin(payload.Pin);
        delayTransition(() => setIsViewingPin(true));
      },
    });
  };

  const handleOnCardSettingsPress = (cardId: string) => {
    navigation.navigate("CardActions.CardSettingsScreen", {
      cardId: cardId,
    });
  };

  const handleOnCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId });
  };

  const handleOnSingleUseCardsGeneratePress = () => {
    navigation.navigate("CardActions.SingleUseCardInfoScreen");
  };

  const handleOnSingleUseCardsAboutPress = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const handleOnActivatePhysicalCard = (cardId: string) => {
    navigation.navigate("CardActions.EnterCardCVVScreen", { cardId });
  };

  const handleOnFreezeCardPress = (cardId: string, cardStatus: CardStatus) => {
    setIsLockConfirmModalVisible(true);
    setSelectedCardId(cardId);
    setSelectedCardStatus(cardStatus);
  };

  const handleOnUnFreezeCardPress = (cardId: string, cardStatus: CardStatus) => {
    setIsUnlockConfirmModalVisible(true);
    setSelectedCardId(cardId);
    setSelectedCardStatus(cardStatus);
  };

  const handleOnLockedSuccess = () => {
    setIsLockedSuccess(false);
    cardsQuery.refetch();
  };

  const handleOnUnLockedSuccess = () => {
    setIsUnLockedSuccess(false);
    cardsQuery.refetch();
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} testID="CardActions.HomeScreen:NavHeader" />
        {cardsQuery.isLoading ? (
          <View style={styles.loading} testID="CardActions.HomeScreen:LoadingIndicator">
            <FullScreenLoader />
          </View>
        ) : (
          <CardList
            data={cardsQuery.data?.Cards ?? []}
            onActivatePhysicalCardPress={handleOnActivatePhysicalCard}
            onCardPress={handleOnCardPress}
            onCardSettingsPress={handleOnCardSettingsPress}
            onFreezeCardPress={handleOnFreezeCardPress}
            onUnfreezeCardPress={handleOnUnFreezeCardPress}
            onViewPinPress={handleOnViewPinPress}
            onSingleUseCardAboutPress={handleOnSingleUseCardsAboutPress}
            onSingleUseCardGeneratePress={handleOnSingleUseCardsGeneratePress}
          />
        )}
        <LoadingErrorNotification
          isVisible={isLoadingErrorVisible}
          onClose={() => setIsLoadingErrorVisible(false)}
          onRefresh={() => cardsQuery.refetch()}
        />
      </Page>
      {pin !== undefined ? (
        <ViewPinModal
          pin={pin}
          visible={isViewingPin}
          onClose={() => setIsViewingPin(false)}
          testID="CardActions.HomeScreen:ViewPinModal"
        />
      ) : null}
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={showErrorModal}
        onClose={handleOnErrorModalClose}
      />
      {/* Lock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button loading={freezeLoading} disabled={freezeLoading} onPress={handleOnFreezeCardConfirmation}>
              {t("CardActions.CardDetailsScreen.lockConfirmationModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsLockConfirmModalVisible(false)}>
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
      />
      {/* Unlock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnUnfreezeCardConfirmation}>
              {t("CardActions.CardDetailsScreen.unlockConfirmationModal.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsUnlockConfirmModalVisible(false)}>
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
            selectedCardStatus === "LOCK"
              ? t("CardActions.CardDetailsScreen.waitPeriodModal.unlockState")
              : t("CardActions.CardDetailsScreen.waitPeriodModal.lockState"),
        })}
        isVisible={isWaitPeriodModalVisible}
      />
      {/* Lock success modal */}
      <NotificationModal
        variant="success"
        title={t("CardActions.CardDetailsScreen.lockSuccessFullModal.title")}
        isVisible={isLockedSuccess}
        buttons={{
          primary: (
            <Button onPress={handleOnLockedSuccess}>
              {t("CardActions.CardDetailsScreen.lockSuccessFullModal.okButton")}
            </Button>
          ),
        }}
      />
      {/* Unlock success modal */}
      <NotificationModal
        variant="success"
        title={t("CardActions.CardDetailsScreen.unLockSuccessFullModal.title")}
        isVisible={isUnLockedSuccess}
        buttons={{
          primary: (
            <Button onPress={handleOnUnLockedSuccess}>
              {t("CardActions.CardDetailsScreen.unLockSuccessFullModal.okButton")}
            </Button>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -49,
  },
});

const ERROR_CARD_STATUS_WAIT_PERIOD = "Cannot Update State Until 5 Minutes Pass";

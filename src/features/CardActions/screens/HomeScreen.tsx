import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

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

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const cardsQuery = useCards();
  const otpFlow = useOtpFlow<AuthenticatedStackParams>();

  const freezeCardAsync = useFreezeCard();
  const changeCardStatusAsync = useChangeCardStatus();
  const requestViewPinOtpAsync = useRequestViewPinOtp();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);

  // display error if api failed to get response.
  useEffect(() => {
    setIsLoadingErrorVisible(cardsQuery.isError);
  }, [cardsQuery.isError]);

  const handleOnFreezeCardPress = async (cardId: string) => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      if (response.Status !== "lock") {
        throw new Error("Received unexpected response from back-end");
      } else {
        cardsQuery.refetch();
      }
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async (cardId: string) => {
    otpFlow.handle({
      action: {
        to: "CardActions.HomeScreen",
      },
      otpOptionalParams: {
        CardId: cardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: async () => {
        return changeCardStatusAsync.mutateAsync({ cardId: cardId, status: "UNLOCK" });
      },
      onFinish: status => {
        if (status === "fail") {
          setShowErrorModal(true);
        } else {
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
            onUnfreezeCardPress={handleOnUnfreezeCardPress}
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
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -49,
  },
});

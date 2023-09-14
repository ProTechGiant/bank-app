import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import FullScreenLoader from "@/components/FullScreenLoader";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { CardList, InlineBanner, ViewPinModal } from "../components";
import { isCardExpiringSoon, isPhysicalCard } from "../helpers";
import { useCards, useChangeCardStatus, useFreezeCard, useRequestViewPinOtp } from "../hooks/query-hooks";
import { Card } from "../types";

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
  const [isCardBannerVisible, setIsCardBannerVisible] = useState(true);
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);

  // display error if api failed to get response.
  useEffect(() => {
    setIsLoadingErrorVisible(cardsQuery.isError);
  }, [cardsQuery.isError]);

  const handleOnFreezeCardPress = async (cardId: string) => {
    try {
      const response = await freezeCardAsync.mutateAsync({ cardId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from back-end");
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async (cardId: string) => {
    otpFlow.handle<undefined, "CardActions.HomeScreen">({
      action: {
        to: "CardActions.HomeScreen",
      },
      otpOptionalParams: {
        CardId: cardId,
      },
      otpVerifyMethod: "card-actions",
      onOtpRequest: () => {
        return changeCardStatusAsync.mutateAsync({ cardId: cardId, status: "unfreeze" });
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

  const handleOnCloseCardNotification = () => {
    setIsCardBannerVisible(false);
  };

  const handleOnActivatePhysicalCard = (cardId: string) => {
    navigation.navigate("CardActions.EnterCardCVVScreen", { cardId });
  };

  const handleOnRenewCardPress = (card: Card) => {
    navigation.navigate("CardActions.ApplyCardScreen", {
      replacingCardId: card.CardId,
      productId: card.ProductId,
    });
  };

  const notificationBannerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));

  const renderNotificationBanner = () => {
    const cardsList = cardsQuery.data?.Cards ?? [];
    const inactiveCard = cardsList.find(card => isPhysicalCard(card) && card.Status === "inactive");
    const expiringCard = cardsList.find(card => isCardExpiringSoon(card));

    if (inactiveCard !== undefined) {
      return (
        <View style={notificationBannerContainerStyle}>
          <InlineBanner
            onClose={handleOnCloseCardNotification}
            title={t("CardActions.CardDeliveryNotification.inactiveTitle")}
            text={t("CardActions.CardDeliveryNotification.inactiveTitle")}
          />
        </View>
      );
    }

    if (expiringCard !== undefined) {
      return (
        <View style={notificationBannerContainerStyle}>
          <InlineBanner
            action={
              <InlineBanner.Button
                onPress={() => handleOnRenewCardPress(expiringCard)}
                text={t("CardActions.CardExpiryNotification.button")}
              />
            }
            onClose={handleOnCloseCardNotification}
            title={t("CardActions.CardExpiryNotification.title")}
            text={t("CardActions.CardExpiryNotification.content")}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} />
        {isCardBannerVisible ? renderNotificationBanner() : null}
        {cardsQuery.isLoading ? (
          <View style={styles.loading}>
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
        <ViewPinModal pin={pin} visible={isViewingPin} onClose={() => setIsViewingPin(false)} />
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

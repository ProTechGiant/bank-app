import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { CloseIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { PHYSICAL_CARD_TYPE, PLUS_TIER, SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { useOtpFlow } from "../../OneTimePassword/hooks/query-hooks";
import { CardBanner, QuickActionsMenu, ViewPinModal } from "../components";
import { hasActiveSingleUseCard, isCardInactive } from "../helpers";
import {
  useCards,
  useChangeCardStatus,
  useCustomerTier,
  useFreezeCard,
  useRequestViewPinOtp,
} from "../hooks/query-hooks";
import { Card } from "../types";

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data } = useCards();
  const customerTier = useCustomerTier();
  const otpFlow = useOtpFlow();

  const freezeCardAsync = useFreezeCard();
  const changeCardStatusAsync = useChangeCardStatus();
  const requestViewPinOtpAsync = useRequestViewPinOtp();

  const cardsList = data?.Cards ?? [];
  const hasSingleUseCard = hasActiveSingleUseCard(cardsList);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(false);
  const [pin, setPin] = useState<string | undefined>();
  const [isCardBannerVisible, setIsCardBannerVisible] = useState(true);

  const handleOnFreezeCardPress = async (cardId: string) => {
    const correlationId = generateRandomId();

    try {
      const response = await freezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.Status !== "freeze") throw new Error("Received unexpected response from back-end");
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not freeze card: ", JSON.stringify(error));
    }
  };

  const handleOnUnfreezeCardPress = async (cardId: string) => {
    try {
      const response = await changeCardStatusAsync.mutateAsync({ cardId: cardId, status: "unfreeze" });

      otpFlow.handle({
        action: {
          to: "CardActions.HomeScreen",
        },
        otpOptionalParams: {
          CardId: cardId,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          otpFormType: "card-actions",
        },
        onOtpRequestResend: () => {
          return changeCardStatusAsync.mutateAsync({ cardId: cardId, status: "unfreeze" });
        },
      });
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not unfreeze card: ", JSON.stringify(error));
    }
  };

  const handleOnErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleOnViewPinPress = async (cardId: string) => {
    try {
      const response = await requestViewPinOtpAsync.mutateAsync({ cardId });

      otpFlow.handle<{ Pin: string }>({
        action: {
          to: "CardActions.HomeScreen",
        },
        otpOptionalParams: {
          CardId: cardId,
        },
        otpChallengeParams: {
          OtpId: response.OtpId,
          OtpCode: response.OtpCode,
          PhoneNumber: response.PhoneNumber,
          otpFormType: "card-actions",
        },
        onOtpRequestResend: () => {
          return requestViewPinOtpAsync.mutateAsync({ cardId });
        },
        onFinish: (status, payload) => {
          if (status === "fail" || status === "cancel" || undefined === payload) return;

          setPin(payload.Pin);
          // Add delay to show Notification Modal otherwise because it will be blocked by the OTP modal and view pin modal cannot be shown
          setTimeout(() => setIsViewingPin(true), 500);
        },
      });
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not retrieve pin OTP: ", JSON.stringify(error));
    }
  };

  const handleOnCardSettingsPress = (card: Card) => {
    navigation.navigate("CardActions.CardSettingsScreen", {
      cardId: card.CardId,
    });
  };

  const handleOnCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId });
  };

  const handleOnPressGenerateNew = () => {
    navigation.navigate("CardActions.SingleUseCardInfoScreen");
  };

  const handleOnPressAbout = () => {
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

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));

  const renderActiveCard = (card: Card) => {
    return (
      <BankCard.Active
        key={card.CardId}
        cardNumber={card.LastFourDigits}
        cardType={card.CardType}
        productId={card.ProductId}
        label={card.ProductId === STANDARD_CARD_PRODUCT_ID ? t("CardActions.standardCard") : t("CardActions.plusCard")}
        endButton={
          <QuickActionsMenu
            cardStatus={card.Status}
            onFreezeCardPress={() => handleOnFreezeCardPress(card.CardId)}
            onUnfreezeCardPress={() => handleOnUnfreezeCardPress(card.CardId)}
            onViewPinPress={() => handleOnViewPinPress(card.CardId)}
            onCardSettingsPress={() => handleOnCardSettingsPress(card)}
          />
        }
        onPress={() => handleOnCardPress(card.CardId)}
        IsExpireSoon={card.IsExpireSoon && card.CardType === PHYSICAL_CARD_TYPE}
        actionButton={
          card.Status === "pending-activation" && card.CardType === PHYSICAL_CARD_TYPE ? (
            <BankCard.ActionButton
              title={t("CardActions.activatePhysicalCard")}
              type="light"
              onPress={() => handleOnActivatePhysicalCard(card.CardId)}
            />
          ) : undefined
        }
      />
    );
  };

  const returnInactiveCard = (card: Card) => {
    return (
      <BankCard.Inactive
        key={card.CardId}
        status={card.Status === "freeze" ? "freeze" : "inactive"}
        cardType={card.CardType}
        label={card.ProductId === STANDARD_CARD_PRODUCT_ID ? t("CardActions.standardCard") : t("CardActions.plusCard")}
        actionButton={
          card.Status === "freeze" ? (
            <BankCard.ActionButton type="dark" title={t("CardActions.cardFrozen")} />
          ) : (
            <BankCard.ActionButton
              type="light"
              title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
              onPress={() => handleOnActivatePhysicalCard(card.CardId)}
            />
          )
        }
        endButton={
          <QuickActionsMenu
            cardStatus={card.Status}
            onFreezeCardPress={() => handleOnFreezeCardPress(card.CardId)}
            onUnfreezeCardPress={() => handleOnUnfreezeCardPress(card.CardId)}
            onViewPinPress={() => handleOnViewPinPress(card.CardId)}
            onCardSettingsPress={() => handleOnCardSettingsPress(card)}
          />
        }
        onPress={() => handleOnCardPress(card.CardId)}
        IsExpireSoon={card.IsExpireSoon && card.CardType === PHYSICAL_CARD_TYPE}
      />
    );
  };

  const setNotificationBanner = () => {
    const firstInactiveCard = cardsList.find(
      card => card.CardType === PHYSICAL_CARD_TYPE && card.Status === "inactive"
    );
    const firstExpiredCard = cardsList.find(card => card.CardType === PHYSICAL_CARD_TYPE && card.IsExpireSoon);

    if (firstInactiveCard !== undefined) {
      return (
        <CardBanner
          icon={<CloseIcon />}
          onClose={handleOnCloseCardNotification}
          title={t("CardActions.CardDeliveryNotification.inactiveTitle")}
          subtitle={t("CardActions.CardDeliveryNotification.inactiveTitle")}
        />
      );
    }

    if (firstExpiredCard !== undefined) {
      return (
        <CardBanner
          icon={<CloseIcon />}
          onClose={handleOnCloseCardNotification}
          title={t("CardActions.CardExpiryNotification.title")}
          subtitle={t("CardActions.CardExpiryNotification.content")}
          actionTitle={t("CardActions.CardExpiryNotification.button")}
          onActionPress={() => handleOnRenewCardPress(firstExpiredCard)}
        />
      );
    }
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"] * 2,
    paddingLeft: I18nManager.isRTL ? theme.spacing["20p"] : 0,
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} />
        {isCardBannerVisible ? setNotificationBanner() : null}
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p" style={contentStyle}>
            {cardsList.map(card =>
              card.CardType !== SINGLE_USE_CARD_TYPE ? (
                card.Status === "inactive" || card.Status === "freeze" ? (
                  returnInactiveCard(card)
                ) : (
                  renderActiveCard(card)
                )
              ) : !isCardInactive(card) ? (
                <BankCard.Active
                  key={card.CardId}
                  cardNumber={card.LastFourDigits}
                  cardType={card.CardType}
                  productId={card.ProductId}
                  endButton={
                    <Pressable onPress={handleOnPressAbout}>
                      <BankCard.EndButton icon={<InfoCircleIcon />} />
                    </Pressable>
                  }
                  onPress={() => handleOnCardPress(card.CardId)}
                  label={t("CardActions.singleUseCard")}
                />
              ) : null
            )}
            {customerTier.data?.tier === PLUS_TIER && !hasSingleUseCard ? (
              <BankCard.Inactive
                status="inactive"
                cardType={SINGLE_USE_CARD_TYPE}
                endButton={
                  <Pressable onPress={handleOnPressAbout}>
                    <BankCard.EndButton icon={<InfoCircleIcon />} />
                  </Pressable>
                }
                actionButton={
                  <BankCard.ActionButton
                    title={t("CardActions.generateNew")}
                    type="light"
                    onPress={handleOnPressGenerateNew}
                  />
                }
                label={t("CardActions.singleUseCard")}
              />
            ) : null}
          </Stack>
        </ScrollView>
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

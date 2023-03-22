import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { PLUS_TIER, SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import QuickActionsMenu from "../../components/QuickActionsMenu";
import ViewPinModal from "../../components/ViewPinModal";
import { isCardInactive } from "../../helpers";
import { useCards, useCustomerTier, useFreezeCard, useRequestViewPinOtp, useUnfreezeCard } from "../../query-hooks";
import { Card } from "../../types";

export default function HomeScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.HomeScreen">>();
  const navigation = useNavigation();

  const { data } = useCards();
  const customerTier = useCustomerTier();

  const cardsList = data?.Cards ?? [];
  const singleUseCard = cardsList.find(card => card.CardType === SINGLE_USE_CARD_TYPE && !isCardInactive(card));

  const freezeCardAsync = useFreezeCard();
  const unfreezeCardAsync = useUnfreezeCard();
  const requestViewPinOtpAsync = useRequestViewPinOtp();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isViewingPin, setIsViewingPin] = useState(route.params?.action === "view-pin");
  const [pin, setPin] = useState<string | undefined>();

  useEffect(() => {
    if (undefined === route.params) return;

    if (route.params?.action === "view-pin") {
      setPin(route.params.pin);
      // Add delay to show Notification Modal otherwise because it will be blocked by the OTP modal and view pin modal cannot be shown
      setTimeout(() => setIsViewingPin(true), 500);
    }
  }, [route.params]);

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
    const correlationId = generateRandomId();

    try {
      const response = await unfreezeCardAsync.mutateAsync({ cardId, correlationId });
      if (response.OtpCode === undefined || response.OtpId === undefined) {
        throw new Error("Could not start OTP flow");
      }

      navigation.navigate("CardActions.OneTimePasswordModal", {
        redirect: "CardActions.HomeScreen",
        action: "unfreeze",
        cardId,
        correlationId: correlationId,
        otp: {
          otpId: response.OtpId,
          otpCode: response.OtpCode,
          phoneNumber: response.PhoneNumber,
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
    const correlationId = generateRandomId();

    try {
      const response = await requestViewPinOtpAsync.mutateAsync({ cardId, correlationId });
      if (response.OtpCode === undefined || response.OtpId === undefined) {
        throw new Error("Could not start OTP flow");
      }

      navigation.navigate("CardActions.OneTimePasswordModal", {
        redirect: "CardActions.HomeScreen",
        action: "view-pin",
        cardId: cardId,
        correlationId: correlationId,
        otp: {
          otpCode: response.OtpCode,
          otpId: response.OtpId,
          phoneNumber: response.PhoneNumber,
        },
      });
    } catch (error) {
      setShowErrorModal(true);
      warn("card-actions", "Could not retrieve pin OTP: ", JSON.stringify(error));
    }
  };

  const handleOnCardSettingsPress = (card: Card) => {
    navigation.navigate("CardActions.CardSettingsScreen", {
      cardStatus: card.Status,
      cardId: card.CardId,
    });
  };

  const handleOnCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", { cardId });
  };

  const handleOnPressGenerateNew = () => {
    navigation.navigate("CardActions.SingleUseCardInfo");
  };

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const handleOnActivateNowPress = () => {
    navigation.navigate("Temporary.DummyScreen");
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
      />
    );
  };

  const returnInactiveCard = (card: Card) => {
    return (
      <BankCard.Inactive
        key={card.CardId}
        status={card.Status === "freeze" ? "freeze" : "inactive"}
        label={card.ProductId === STANDARD_CARD_PRODUCT_ID ? t("CardActions.standardCard") : t("CardActions.plusCard")}
        actionButton={
          card.Status === "freeze" ? (
            <BankCard.ActionButton type="dark" title={t("CardActions.cardFrozen")} />
          ) : (
            <BankCard.ActionButton
              type="light"
              title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
              onPress={handleOnActivateNowPress}
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
      />
    );
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"] * 2,
    paddingLeft: I18nManager.isRTL ? theme.spacing["20p"] : 0,
  }));

  return (
    <>
      <Page>
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} />
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p" style={contentStyle}>
            {cardsList.map(card =>
              card.CardType !== SINGLE_USE_CARD_TYPE ? (
                card.Status === "unfreeze" ? (
                  renderActiveCard(card)
                ) : (
                  returnInactiveCard(card)
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
            {customerTier.data?.tier === PLUS_TIER && singleUseCard === undefined ? (
              <BankCard.Inactive
                status="inactive"
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

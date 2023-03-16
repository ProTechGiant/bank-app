import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { warn } from "@/logger";
import { inactiveCards } from "@/mocks/inactiveCards";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { generateRandomId } from "@/utils";

import { CardActionsStackParams } from "../../CardActionsStack";
import QuickActionsMenu from "../../components/QuickActionsMenu";
import ViewPinModal from "../../components/ViewPinModal";
import { useCards, useCustomerTier, useFreezeCard, useRequestViewPinOtp, useUnfreezeCard } from "../../query-hooks";
import { Card, CardType } from "../../types";

export default function HomeScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.HomeScreen">>();
  const navigation = useNavigation();

  const { data } = useCards();
  const customerTier = useCustomerTier();

  const cardsList = data?.Cards;
  const singleUseCard = cardsList?.find(card => card?.CardType === SINGLE_USE_CARD_TYPE);

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
      setTimeout(() => {
        setIsViewingPin(true);
      }, 500);
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
      if (response.OtpCode !== undefined && response.OtpId !== undefined) {
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
      } else {
        setShowErrorModal(true);
      }
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

      if (response.OtpCode !== undefined) {
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
      } else {
        setShowErrorModal(true);
      }
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

  const handleOnActiveCardPress = (cardId: string, cardType: CardType) => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardType,
      cardStatus: "active",
      cardId: cardId,
    });
  };

  const handleOnInactiveCardPress = (cardId: string, cardType: CardType) => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardType,
      cardStatus: "inactive",
      cardId: cardId,
    });
  };

  const handleOnSingleUseCardPress = (cardId: string) => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardType: "single-use",
      cardId: cardId,
    });
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

  return (
    <>
      <Page>
        <NavHeader title={t("CardActions.HomeScreen.navTitle")} end={false} />
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p">
            {cardsList?.map(card =>
              card.CardType !== SINGLE_USE_CARD_TYPE ? (
                card.Status === "unfreeze" ? (
                  <BankCard.Active
                    key={card.CardId}
                    cardNumber={card.LastFourDigits}
                    cardType={card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus"}
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    endButton={
                      <QuickActionsMenu
                        cardStatus="active"
                        onFreezeCardPress={() => handleOnFreezeCardPress(card.CardId)}
                        onUnfreezeCardPress={() => handleOnUnfreezeCardPress(card.CardId)}
                        onViewPinPress={() => handleOnViewPinPress(card.CardId)}
                        onCardSettingsPress={() => handleOnCardSettingsPress(card)}
                      />
                    }
                    onPress={() =>
                      handleOnActiveCardPress(
                        card.CardId,
                        card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus"
                      )
                    }
                  />
                ) : card.Status === "freeze" ? (
                  <BankCard.Inactive
                    key={card.CardId}
                    type="frozen"
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    actionButton={<BankCard.ActionButton type="dark" title={t("CardActions.cardFrozen")} />}
                    endButton={
                      <QuickActionsMenu
                        cardStatus="frozen"
                        onFreezeCardPress={() => handleOnFreezeCardPress(card.CardId)}
                        onUnfreezeCardPress={() => handleOnUnfreezeCardPress(card.CardId)}
                        onViewPinPress={() => handleOnViewPinPress(card.CardId)}
                        onCardSettingsPress={() => handleOnCardSettingsPress(card)}
                      />
                    }
                    onPress={() =>
                      handleOnActiveCardPress(
                        card.CardId,
                        card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus"
                      )
                    }
                  />
                ) : (
                  <BankCard.Inactive
                    key={card.CardId}
                    type="inactive"
                    label={
                      card.ProductId === STANDARD_CARD_PRODUCT_ID
                        ? t("CardActions.standardCard")
                        : t("CardActions.plusCard")
                    }
                    actionButton={
                      <BankCard.ActionButton
                        type="light"
                        title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                        onPress={handleOnActivateNowPress}
                      />
                    }
                    endButton={
                      <QuickActionsMenu
                        cardStatus="inactive"
                        onFreezeCardPress={() => handleOnFreezeCardPress(card.CardId)}
                        onUnfreezeCardPress={() => handleOnUnfreezeCardPress(card.CardId)}
                        onViewPinPress={() => handleOnViewPinPress(card.CardId)}
                        onCardSettingsPress={() => handleOnCardSettingsPress(card)}
                      />
                    }
                    onPress={() =>
                      handleOnInactiveCardPress(
                        card.CardId,
                        card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus"
                      )
                    }
                  />
                )
              ) : (
                <BankCard.Active
                  key={card.CardId}
                  cardNumber={card.LastFourDigits}
                  cardType="single-use"
                  endButton={
                    <Pressable onPress={handleOnPressAbout}>
                      <BankCard.EndButton icon={<InfoCircleIcon />} />
                    </Pressable>
                  }
                  onPress={() => handleOnSingleUseCardPress(card.CardId)}
                  label={t("CardActions.singleUseCard")}
                />
              )
            )}
            {inactiveCards.map(card => (
              <BankCard.Inactive
                key={card.CardId}
                type="inactive"
                label={
                  card.ProductId === STANDARD_CARD_PRODUCT_ID
                    ? t("CardActions.standardCard")
                    : t("CardActions.plusCard")
                }
                actionButton={
                  <BankCard.ActionButton
                    type="light"
                    title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
                    onPress={handleOnActivateNowPress}
                  />
                }
                onPress={() =>
                  handleOnInactiveCardPress("", card.ProductId === STANDARD_CARD_PRODUCT_ID ? "standard" : "plus")
                }
                endButton={
                  <QuickActionsMenu
                    cardStatus="inactive"
                    onFreezeCardPress={() => handleOnFreezeCardPress("")}
                    onUnfreezeCardPress={() => handleOnUnfreezeCardPress("")}
                    onViewPinPress={() => handleOnViewPinPress("")}
                    onCardSettingsPress={() => handleOnCardSettingsPress(card)}
                  />
                }
              />
            ))}
            {customerTier.data?.tier === "Plus" && singleUseCard === undefined ? (
              <BankCard.Inactive
                type="inactive"
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
        <ViewPinModal
          pin={pin}
          visible={isViewingPin}
          onClose={() => {
            setIsViewingPin(false);
          }}
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

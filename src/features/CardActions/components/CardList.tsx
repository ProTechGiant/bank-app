import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import { PLUS_TIER, SINGLE_USE_CARD_TYPE, STANDARD_CARD_PRODUCT_ID, VIRTUAL_CARD_TYPE } from "@/constants";
import { useThemeStyles } from "@/theme";

import { hasActiveSingleUseCard, isSingleUseCard, isSingleUseCardInactive } from "../helpers";
import { useCustomerTier } from "../hooks/query-hooks";
import { Card, CardStatus } from "../types";
import QuickActionsMenu from "./QuickActionsMenu";

interface CardsListProps {
  data: Card[];
  onActivatePhysicalCardPress: (cardId: string) => void;
  onCardPress: (cardId: string) => void;
  onCardSettingsPress: (cardId: string) => void;
  onFreezeCardPress: (cardId: string, cardStatus: CardStatus) => void;
  onUnfreezeCardPress: (cardId: string, cardStatus: CardStatus) => void;
  onViewPinPress: (cardId: string) => void;
  onSingleUseCardAboutPress: () => void;
  onSingleUseCardGeneratePress: () => void;
}

export default function CardsList({
  data,
  onActivatePhysicalCardPress,
  onCardPress,
  onCardSettingsPress,
  onFreezeCardPress,
  onUnfreezeCardPress,
  onViewPinPress,
  onSingleUseCardAboutPress,
  onSingleUseCardGeneratePress,
}: CardsListProps) {
  const { t } = useTranslation();

  const customerTier = useCustomerTier();
  const hasSingleUseCard = hasActiveSingleUseCard(data);

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
            onFreezeCardPress={() => onFreezeCardPress(card.CardId, card.Status)}
            onUnfreezeCardPress={() => onUnfreezeCardPress(card.CardId, card.Status)}
            onViewPinPress={() => onViewPinPress(card.CardId)}
            onCardSettingsPress={() => onCardSettingsPress(card.CardId)}
            testID={`CardActions.HomeScreen:ActiveCard-${card.CardId}-QuickActions`}
          />
        }
        onPress={() => onCardPress(card.CardId)}
        actionButton={
          card.Status === "PENDING-ACTIVATION" && card.CardType === VIRTUAL_CARD_TYPE ? (
            <BankCard.ActionButton
              title={t("CardActions.activateCard")}
              type="light"
              onPress={() => onActivatePhysicalCardPress(card.CardId)}
              testID={`CardActions.HomeScreen:ActiveCard-${card.CardId}-ActivateButton`}
            />
          ) : undefined
        }
        testID={`CardActions.HomeScreen:ActiveCard-${card.CardId}`}
      />
    );
  };

  const renderInactiveCard = (card: Card) => {
    return (
      <BankCard.Inactive
        key={card.CardId}
        status={card.Status === "LOCK" ? "LOCK" : "INACTIVE"}
        cardType={card.CardType}
        label={card.ProductId === STANDARD_CARD_PRODUCT_ID ? t("CardActions.standardCard") : t("CardActions.plusCard")}
        actionButton={
          card.Status === "LOCK" ? (
            <BankCard.ActionButton type="dark" title={t("CardActions.cardFrozen")} />
          ) : (
            <BankCard.ActionButton
              type="light"
              title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
              onPress={() => onActivatePhysicalCardPress(card.CardId)}
              testID={`CardActions.HomeScreen:InactiveCard-${card.CardId}-ActivateButton`}
            />
          )
        }
        endButton={
          <QuickActionsMenu
            cardStatus={card.Status}
            onFreezeCardPress={() => onFreezeCardPress(card.CardId, card.Status)}
            onUnfreezeCardPress={() => onUnfreezeCardPress(card.CardId, card.Status)}
            onViewPinPress={() => onViewPinPress(card.CardId)}
            onCardSettingsPress={() => onCardSettingsPress(card.CardId)}
            testID={`CardActions.HomeScreen:InactiveCard-${card.CardId}-QuickActions`}
          />
        }
        onPress={() => onCardPress(card.CardId)}
        testID={`CardActions.HomeScreen:InactiveCard-${card.CardId}`}
      />
    );
  };

  const renderSingleUseCard = (card: Card) => {
    return (
      <BankCard.Active
        key={card.CardId}
        cardNumber={card.LastFourDigits}
        cardType={card.CardType}
        productId={card.ProductId}
        endButton={
          <Pressable onPress={onSingleUseCardAboutPress}>
            <BankCard.EndButton icon={<InfoCircleIcon />} />
          </Pressable>
        }
        onPress={() => onCardPress(card.CardId)}
        label={t("CardActions.singleUseCard")}
        testID={`CardActions.HomeScreen:SingleUseCard-${card.CardId}`}
      />
    );
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["20p"],
    paddingRight: I18nManager.isRTL ? theme.spacing["20p"] : theme.spacing["20p"] * 2,
    paddingLeft: I18nManager.isRTL ? theme.spacing["20p"] : 0,
  }));

  return (
    <ScrollView contentContainerStyle={contentStyle} horizontal style={containerStyle}>
      {data.map(element => {
        if (!isSingleUseCard(element)) {
          return element.Status === "INACTIVE" || element.Status === "LOCK"
            ? renderInactiveCard(element)
            : renderActiveCard(element);
        }

        return !isSingleUseCardInactive(element) ? renderSingleUseCard(element) : null;
      })}
      {customerTier.data?.Tier === PLUS_TIER && !hasSingleUseCard ? (
        <BankCard.Inactive
          status="INACTIVE"
          cardType={SINGLE_USE_CARD_TYPE}
          endButton={
            <Pressable
              onPress={onSingleUseCardAboutPress}
              testID="CardActions.HomeScreen:SingleUseCardPlaceholderAboutButton">
              <BankCard.EndButton icon={<InfoCircleIcon />} />
            </Pressable>
          }
          actionButton={
            <BankCard.ActionButton
              title={t("CardActions.generateNew")}
              type="light"
              onPress={onSingleUseCardGeneratePress}
              testID="CardActions.HomeScreen:SingleUseCardPlaceholderGenerateButton"
            />
          }
          label={t("CardActions.singleUseCard")}
          testID="CardActions.HomeScreen:SingleUseCardPlaceholder"
        />
      ) : null}
    </ScrollView>
  );
}

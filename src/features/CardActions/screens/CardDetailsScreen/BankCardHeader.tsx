import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import BankCard from "@/components/BankCard";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import { isPhysicalCard, isSingleUseCard } from "../../helpers";
import { Card, DetailedCardResponse } from "../../types";

interface BankCardHeaderProps {
  card: Card;
  cardDetails: DetailedCardResponse | undefined;
  onActivatePress: () => void;
  onRenewCardPress: () => void;
  onShowDetailsPress: () => void;
  onFreezePress: () => void;
}

export default function BankCardHeader({
  card,
  cardDetails,
  onActivatePress,
  onRenewCardPress,
  onShowDetailsPress,
  onFreezePress,
}: BankCardHeaderProps) {
  const { t } = useTranslation();
  const addToast = useToasts();

  const handleOnCopy = (value: string) => {
    Clipboard.setString(value);
    addToast({
      variant: "confirm",
      message: t("CardActions.CardDetailsScreen.copyClipboard"),
    });
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  return (
    <View style={containerStyle}>
      {card.Status === "LOCK" && cardDetails === undefined && !isSingleUseCard(card) ? (
        <BankCard.Inactive
          status="LOCK"
          cardType={card.CardType}
          actionButton={
            <BankCard.ActionButton onPress={onFreezePress} title={t("CardActions.cardFrozen")} type="light" />
          }
          testID="CardActions.CardDetailsScreen:InactiveBankCard"
        />
      ) : card.Status === "INACTIVE" && isPhysicalCard(card) ? (
        <BankCard.Inactive
          status="INACTIVE"
          cardType={card.CardType}
          actionButton={
            <BankCard.ActionButton
              type="light"
              title={t("CardActions.CardDetailsScreen.inactiveCard.actionButtonText")}
              onPress={onActivatePress}
              testID="CardActions.CardDetailsScreen:InactiveBankCardActivateButton"
            />
          }
          testID="CardActions.CardDetailsScreen:InactiveBankCard"
        />
      ) : cardDetails === undefined ? (
        <BankCard.Active
          cardType={card.CardType}
          productId={card.ProductId}
          isExpireSoon={card.IsExpireSoon}
          onShowDetailsPress={onShowDetailsPress}
          onFreezePress={onFreezePress}
          actionButton={
            card.Status === "NEW_CARD" ? (
              <BankCard.ActionButton
                title={t("CardActions.activateCard")}
                type="light"
                onPress={onActivatePress}
                testID="CardActions.CardDetailsScreen:ActiveBankCardActivateButton"
              />
            ) : card.IsExpireSoon ? (
              <BankCard.ActionButton
                title={t("CardActions.renewCard")}
                type="light"
                onPress={onRenewCardPress}
                testID="CardActions.CardDetailsScreen:ActiveBankCardReactivateButton"
              />
            ) : undefined
          }
          testID="CardActions.CardDetailsScreen:ActiveBankCard"
        />
      ) : (
        <BankCard.Unmasked
          cardType={card.CardType}
          cardDetails={cardDetails}
          onCopyPress={handleOnCopy}
          productId={card.ProductId}
          cardStatus={card.Status}
          testID="CardActions.CardDetailsScreen:UnmaskedBankCard"
        />
      )}
    </View>
  );
}

import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import BankCard from "@/components/BankCard";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import { isCardExpiringSoon, isPhysicalCard, isSingleUseCard } from "../../helpers";
import { Card, DetailedCardResponse } from "../../types";

interface BankCardHeaderProps {
  card: Card;
  cardDetails: DetailedCardResponse | undefined;
  onActivatePress: () => void;
}

export default function BankCardHeader({ card, cardDetails, onActivatePress }: BankCardHeaderProps) {
  const { t } = useTranslation();
  const addToast = useToasts();

  const handleOnCopyCardNumberPress = () => {
    if (cardDetails?.CardNumber === undefined) {
      return;
    }

    Clipboard.setString(cardDetails.CardNumber);

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
          isExpiringSoon={isCardExpiringSoon(card)}
          actionButton={<BankCard.ActionButton title={t("CardActions.cardFrozen")} type="dark" />}
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
            />
          }
        />
      ) : cardDetails === undefined ? (
        <BankCard.Active
          status={card.Status}
          cardNumber={card.LastFourDigits}
          cardType={card.CardType}
          productId={card.ProductId}
          isExpiringSoon={isCardExpiringSoon(card)}
          label="Standard"
          actionButton={
            card.Status === "PENDING-ACTIVATION" && isPhysicalCard(card) ? (
              <BankCard.ActionButton
                title={t("CardActions.activatePhysicalCard")}
                type="light"
                onPress={onActivatePress}
              />
            ) : undefined
          }
        />
      ) : (
        <BankCard.Unmasked
          cardNumber={cardDetails.CardNumber}
          cardType={card.CardType}
          cardDetails={{ endDate: cardDetails.ExpDate, securityCode: cardDetails.Cvv }}
          onCopyPress={handleOnCopyCardNumberPress}
          productId={card.ProductId}
          cardStatus={card.Status}
        />
      )}
    </View>
  );
}

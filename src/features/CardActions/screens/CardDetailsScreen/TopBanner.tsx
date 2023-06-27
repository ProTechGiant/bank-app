import { useTranslation } from "react-i18next";
import { Platform, View, ViewStyle } from "react-native";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import { InlineBanner } from "../../components";
import { isCardExpiringSoon, isPhysicalCard } from "../../helpers";
import { Card } from "../../types";

interface TopBannerProps {
  card: Card;
  onClose: () => void;
  onRenewPress: () => void;
  isVisible: boolean;
}

export default function TopBanner({ card, onClose, onRenewPress, isVisible }: TopBannerProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  if (!isVisible || !isPhysicalCard(card)) {
    return null;
  }

  if (isCardExpiringSoon(card)) {
    return (
      <View style={containerStyle}>
        <InlineBanner
          action={<InlineBanner.Button onPress={onRenewPress} text={t("CardActions.CardExpiryNotification.button")} />}
          onClose={() => onClose()}
          title={t("CardActions.CardExpiryNotification.title")}
          text={t("CardActions.CardExpiryNotification.content")}
        />
      </View>
    );
  }

  if (card.Status === "pending-activation" || card.Status === "inactive") {
    return (
      <View style={containerStyle}>
        <InlineBanner
          onClose={() => onClose()}
          icon={<ErrorFilledCircleIcon />}
          title={
            card.Status === "inactive"
              ? t("CardActions.CardDeliveryNotification.inactiveTitle")
              : t("CardActions.CardDeliveryNotification.title")
          }
          text={
            card.Status === "inactive"
              ? t("CardActions.CardDeliveryNotification.inactiveContent")
              : Platform.OS === "ios"
              ? t("CardActions.CardDeliveryNotification.content.ios")
              : t("CardActions.CardDeliveryNotification.content.android")
          }
        />
      </View>
    );
  }

  return null;
}

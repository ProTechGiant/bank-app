import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { LockIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { PHYSICAL_CARD_TYPE, SINGLE_USE_CARD_TYPE, VIRTUAL_CARD_TYPE } from "@/constants";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import CardInactiveSvg from "./card-inactive.svg";

interface InactiveBankCardProps {
  actionButton: React.ReactElement<ActionButtonProps>;
  endButton?: React.ReactNode;
  label?: string;
  status: "INACTIVE" | "LOCK";
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  onPress?: () => void;
  isExpiringSoon?: boolean;
}

export default function InactiveBankCard({
  actionButton,
  endButton,
  label,
  status,
  cardType,
  onPress,
  isExpiringSoon,
}: InactiveBankCardProps) {
  const { t } = useTranslation();
  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: theme.spacing["48p"],
    ...StyleSheet.absoluteFillObject,
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    borderRadius: 4,
    borderWidth: 0,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const cardExpiryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.extraSmall,
    marginBottom: theme.spacing["48p"],
  }));

  const lockCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["interactionBase-30"],
    flex: 1,
    borderRadius: theme.spacing["12p"],
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["24p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(() => ({
    height: status === "LOCK" ? CONTAINER_HEIGHT_HORIZONTALCARD : CONTAINER_HEIGHT,
    width: status === "LOCK" ? CONTAINER_WIDTH_HORIZONTALCARD : CONTAINER_WIDTH,
  }));
  return (
    <View style={containerStyle}>
      {status === "INACTIVE" ? (
        <CardInactiveSvg />
      ) : (
        <View style={lockCardContainerStyle}>
          <Stack direction="vertical" justify="center" align="center" gap="8p">
            <LockIcon width={32} height={32} />
            <Typography.Text size="title3" weight="medium">
              {t("CardActions.CardDetailsScreen.lockCardView.cardLocked")}
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" align="center">
              {t("CardActions.CardDetailsScreen.lockCardView.cardLockedDetail")}
            </Typography.Text>
          </Stack>
        </View>
      )}
      <View style={[containerStyle, contentStyles]}>
        <View style={styles.header}>
          {status !== "LOCK" && label ? (
            <View style={labelStyle}>
              <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
                {label}
              </Typography.Text>
            </View>
          ) : null}
          {endButton}
        </View>
        {status === "INACTIVE" && cardType === PHYSICAL_CARD_TYPE ? (
          <View style={cardExpiryContainerStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {isExpiringSoon ? t("CardActions.CardExpiryNotification.isExpiringSoon") : t("CardActions.comingSoon")}
            </Typography.Text>
          </View>
        ) : isExpiringSoon && cardType === PHYSICAL_CARD_TYPE ? (
          <View style={cardExpiryContainerStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {t("CardActions.CardExpiryNotification.isExpiringSoon")}
            </Typography.Text>
          </View>
        ) : null}
        {onPress !== undefined ? (
          <>
            <Pressable onPress={onPress} style={styles.pressableAreaTop} />
            <Pressable onPress={onPress} style={styles.pressableAreaBottom} />
          </>
        ) : null}
        {status !== "LOCK" ? <View>{actionButton}</View> : null}
      </View>
    </View>
  );
}

const CONTAINER_HEIGHT = 338;
const CONTAINER_WIDTH = 224;
const CONTAINER_HEIGHT_HORIZONTALCARD = 205;
const CONTAINER_WIDTH_HORIZONTALCARD = 326;

const TOP_END_BUTTON_WIDTH = 60;
const PRESSABLE_TOP_AREA = 50;

const styles = StyleSheet.create({
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pressableAreaBottom: {
    height: CONTAINER_HEIGHT_HORIZONTALCARD - PRESSABLE_TOP_AREA,
    left: 0,
    position: "absolute",
    top: PRESSABLE_TOP_AREA,
    width: CONTAINER_WIDTH_HORIZONTALCARD,
  },
  pressableAreaTop: {
    height: PRESSABLE_TOP_AREA,
    left: I18nManager.isRTL ? 0 : undefined,
    position: "absolute",
    right: I18nManager.isRTL ? undefined : 0,
    top: 0,
    width: CONTAINER_WIDTH_HORIZONTALCARD - TOP_END_BUTTON_WIDTH,
  },
});

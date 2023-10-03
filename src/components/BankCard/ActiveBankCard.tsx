import { times } from "lodash";
import { useTranslation } from "react-i18next";
import { I18nManager, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CroatiaLogoIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import PlusCardActiveSvg from "./plus-card.svg";
import SingleUseCardActiveSvg from "./single-use-card.svg";
import StandardCardActiveSvg from "./standard-card.svg";

interface ActiveBankCardProps {
  cardNumber: string;
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  endButton?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  productId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
  isExpiringSoon?: boolean;
  actionButton?: React.ReactElement<ActionButtonProps>;
}

export default function ActiveBankCard({
  cardNumber,
  cardType,
  endButton,
  label,
  productId,
  onPress,
  isExpiringSoon,
  actionButton,
}: ActiveBankCardProps) {
  const { t } = useTranslation();

  const contentStyles = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    ...StyleSheet.absoluteFillObject,
  }));

  const dotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: 2,
    borderWidth: 0,
    height: 4,
    width: 4,
  }));

  const cardExpiryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#00000066",
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.extraSmall,
    marginTop: theme.spacing["48p"],
  }));

  const numberContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    position: "absolute",
    bottom: theme.spacing["20p"],
    left: I18nManager.isRTL ? undefined : theme.spacing["20p"],
    right: I18nManager.isRTL ? theme.spacing["20p"] : undefined,
  }));

  return (
    <View style={styles.container}>
      {cardType === SINGLE_USE_CARD_TYPE ? (
        <SingleUseCardActiveSvg />
      ) : productId === STANDARD_CARD_PRODUCT_ID ? (
        <StandardCardActiveSvg />
      ) : (
        <PlusCardActiveSvg />
      )}

      <View style={[styles.container, contentStyles]}>
        <View style={styles.header}>
          {undefined !== label ? (
            <Typography.Text color="neutralBase-50" size="footnote" weight="medium">
              {label}
            </Typography.Text>
          ) : (
            <View />
          )}
          {endButton}
        </View>
        {isExpiringSoon ? (
          <View style={cardExpiryContainerStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {t("CardActions.CardExpiryNotification.isExpiringSoon")}
            </Typography.Text>
          </View>
        ) : null}
        <View style={numberContainerStyle}>
          <Stack align="center" direction="horizontal" gap="12p">
            <Stack direction="horizontal" gap="4p">
              {times(4).map(currentDotIndex => (
                <View key={currentDotIndex} style={dotStyle} />
              ))}
            </Stack>

            <Typography.Text color="neutralBase-50" size="callout" weight="medium">
              {cardNumber}
            </Typography.Text>
          </Stack>
        </View>
      </View>
      <View style={styles.actionContainer}>{actionButton !== undefined ? actionButton : <CroatiaLogoIcon />}</View>
      {/* Pressable area for redirecting to card details page */}
      {onPress !== undefined ? (
        <>
          <Pressable onPress={onPress} style={styles.pressableAreaTop} />
          <Pressable onPress={onPress} style={styles.pressableAreaBottom} />
        </>
      ) : null}
    </View>
  );
}

const CONTAINER_HEIGHT = 205;
const CONTAINER_WIDTH = 326;

const TOP_END_BUTTON_WIDTH = 60;
const PRESSABLE_TOP_AREA = 60;

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    width: "100%",
  },

  pressableAreaBottom: {
    height: CONTAINER_HEIGHT - PRESSABLE_TOP_AREA,
    left: 0,
    position: "absolute",
    top: PRESSABLE_TOP_AREA,
    width: CONTAINER_WIDTH,
  },
  pressableAreaTop: {
    height: PRESSABLE_TOP_AREA,
    left: Platform.OS === "ios" ? 0 : undefined,
    position: "absolute",
    right: Platform.OS === "android" ? 0 : undefined,
    top: 0,
    width: CONTAINER_WIDTH - TOP_END_BUTTON_WIDTH,
  },
});

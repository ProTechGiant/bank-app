import { times } from "lodash";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

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
    alignItems: "center",
    paddingHorizontal: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
    paddingBottom: 99,
    ...StyleSheet.absoluteFillObject,
  }));

  const labelStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#00000014",
    borderRadius: theme.radii.extraSmall,
    borderWidth: 0,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
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
            <View style={labelStyle}>
              <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
                {label}
              </Typography.Text>
            </View>
          ) : (
            <View />
          )}
          {endButton}
        </View>
        {isExpiringSoon || actionButton !== undefined ? (
          <View style={cardExpiryContainerStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {isExpiringSoon ? t("CardActions.CardExpiryNotification.isExpiringSoon") : t("CardActions.comingSoon")}
            </Typography.Text>
          </View>
        ) : null}
        <View style={styles.numberContainer}>
          <Stack align="center" direction="horizontal" gap="12p">
            {times(3).map(dotSequenceIndex => (
              <Stack direction="horizontal" key={dotSequenceIndex} gap="4p">
                {times(4).map(currentDotIndex => (
                  <View key={currentDotIndex} style={dotStyle} />
                ))}
              </Stack>
            ))}
            <Typography.Text color="neutralBase-50" size="callout">
              {cardNumber}
            </Typography.Text>
          </Stack>
        </View>
      </View>
      {/* Pressable area for redirecting to card details page */}
      {onPress !== undefined ? (
        <>
          <Pressable onPress={onPress} style={styles.pressableAreaTop} />
          <Pressable onPress={onPress} style={styles.pressableAreaBottom} />
        </>
      ) : null}
      {actionButton ? <View style={styles.actionContainer}>{actionButton}</View> : null}
    </View>
  );
}

const CONTAINER_HEIGHT = 338;
const CONTAINER_WIDTH = 224;

const TOP_END_BUTTON_WIDTH = 60;
const PRESSABLE_TOP_AREA = 50;

const styles = StyleSheet.create({
  actionContainer: {
    alignSelf: "center",
    bottom: 100,
    flexDirection: "row",
  },
  container: {
    height: CONTAINER_HEIGHT,
    width: CONTAINER_WIDTH,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  numberContainer: {
    bottom: 120,
    position: "absolute",
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
    left: 0,
    position: "absolute",
    top: 0,
    width: CONTAINER_WIDTH - TOP_END_BUTTON_WIDTH,
  },
});

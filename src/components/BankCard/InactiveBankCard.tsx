import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { PHYSICAL_CARD_TYPE, SINGLE_USE_CARD_TYPE, VIRTUAL_CARD_TYPE } from "@/constants";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import CardFrozenSvg from "./card-frozen.svg";
import CardInactiveSvg from "./card-inactive.svg";

interface InactiveBankCardProps {
  actionButton: React.ReactElement<ActionButtonProps>;
  endButton?: React.ReactNode;
  label?: string;
  status: "inactive" | "freeze";
  cardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  onPress?: () => void;
}

export default function InactiveBankCard({
  actionButton,
  endButton,
  label,
  status,
  cardType,
  onPress,
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
    backgroundColor: "#00000014",
    borderRadius: 4,
    borderWidth: 0,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const cardExpiryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#00000066",
    paddingVertical: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.extraSmall,
    marginBottom: theme.spacing["48p"],
  }));

  return (
    <View style={styles.container}>
      {status === "inactive" ? <CardInactiveSvg /> : <CardFrozenSvg />}
      <View style={[styles.container, contentStyles]}>
        <View style={styles.header}>
          {label ? (
            <View style={labelStyle}>
              <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
                {label}
              </Typography.Text>
            </View>
          ) : null}
          {endButton}
        </View>
        {status === "inactive" && cardType === PHYSICAL_CARD_TYPE ? (
          <View style={cardExpiryContainerStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {t("CardActions.comingSoon")}
            </Typography.Text>
          </View>
        ) : null}
        {onPress !== undefined && (
          <>
            <Pressable onPress={onPress} style={styles.pressableAreaTop} />
            <Pressable onPress={onPress} style={styles.pressableAreaBottom} />
          </>
        )}
        <View>{actionButton}</View>
      </View>
    </View>
  );
}

const CONTAINER_HEIGHT = 338;
const CONTAINER_WIDTH = 224;

const TOP_END_BUTTON_WIDTH = 60;
const PRESSABLE_TOP_AREA = 50;

const styles = StyleSheet.create({
  container: {
    height: 338,
    width: 224,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pressableAreaBottom: {
    height: CONTAINER_HEIGHT - 100,
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

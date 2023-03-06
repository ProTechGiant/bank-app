import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ActionButtonProps } from "./ActionButton";
import CardFrozenSvg from "./card-frozen.svg";
import CardInactiveSvg from "./card-inactive.svg";

interface InactiveBankCardProps {
  actionButton: React.ReactElement<ActionButtonProps>;
  endButton?: React.ReactNode;
  label: string;
  type: "frozen" | "inactive";
  onPress?: () => void;
}

export default function InactiveBankCard({ actionButton, endButton, label, type, onPress }: InactiveBankCardProps) {
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

  return (
    <View style={styles.container}>
      {type === "inactive" ? <CardInactiveSvg /> : <CardFrozenSvg />}
      <View style={[styles.container, contentStyles]}>
        <View style={styles.header}>
          <View style={labelStyle}>
            <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
              {label}
            </Typography.Text>
          </View>
          {endButton}
        </View>
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

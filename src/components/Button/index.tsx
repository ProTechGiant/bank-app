import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ButtonProps {
  children: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  size: "small" | "medium" | "large";
  variant: "primary" | "secondary" | "tertiary";
}

export default function Button({ children, iconLeft, iconRight, onPress, size, variant }: ButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor:
      variant === "primary"
        ? theme.palette.primaryBase
        : variant === "secondary"
        ? theme.palette["primaryBase-30"]
        : undefined,
    borderRadius: variant !== "tertiary" ? (size === "large" ? 16 : size === "medium" ? 14 : 12) : 0,
    paddingHorizontal: variant !== "tertiary" ? 16 : 0,
    paddingVertical: variant !== "tertiary" ? (size === "large" ? 16 : size === "medium" ? 12 : 8) : 0,
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, containerStyles]}>
        {undefined !== iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        <Typography.Text color={variant === "primary" ? "neutralBase-30" : "primaryBase"} size="body" weight="regular">
          {children}
        </Typography.Text>
        {undefined !== iconRight && <View style={styles.icon}>{iconRight}</View>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginHorizontal: 8 / 2,
  },
});

import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: string | React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size: "small" | "medium" | "large";
  variant: "primary" | "secondary" | "tertiary";
}

export default function Button({ children, iconLeft, iconRight, onPress, size, variant, ...restProps }: ButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor:
        variant === "primary"
          ? theme.palette.primaryBase
          : variant === "secondary"
          ? theme.palette["primaryBase-30"]
          : undefined,
      borderRadius:
        variant !== "tertiary"
          ? size === "large"
            ? theme.spacing.medium
            : size === "medium"
            ? theme.spacing.medium - 2
            : theme.spacing.medium - 4
          : 0,
      paddingHorizontal: variant !== "tertiary" ? theme.spacing.medium : 0,
      paddingVertical:
        variant !== "tertiary"
          ? size === "large"
            ? theme.spacing.medium
            : size === "medium"
            ? theme.spacing.medium - 4
            : theme.spacing.small
          : 0,
    }),
    [size, variant]
  );

  return (
    <Pressable {...restProps}>
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

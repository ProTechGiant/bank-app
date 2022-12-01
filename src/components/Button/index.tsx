import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children?: string | React.ReactNode;
  color?: "base" | "alt";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: "has icons" | "no icons" | "loader";
  variant?: "primary" | "secondary" | "tertiary";
}

export default function Button({
  children,
  color = "base",
  iconLeft,
  disabled,
  iconRight,
  type = "no icons",
  variant = "primary",
  ...restProps
}: ButtonProps) {
  const containerStyles = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor:
        variant === "primary"
          ? color === "base"
            ? theme.palette.primaryBase
            : theme.palette.complimentBase
          : undefined,
      borderRadius: theme.radii.extraSmall,
      borderWidth: variant === "secondary" ? 1 : 0,
      borderColor: color === "base" ? theme.palette.primaryBase : theme.palette.complimentBase,
      opacity: disabled ? 0.5 : 1,
      paddingHorizontal: type === "has icons" ? theme.spacing.small : theme.spacing.medium,
      paddingVertical: theme.spacing.medium,
    }),
    [type, variant]
  );

  return (
    <Pressable {...restProps}>
      <View style={[styles.container, containerStyles]}>
        {undefined !== iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        {type === "loader" ? (
          <ActivityIndicator size="small" />
        ) : (
          <Typography.Text
            color={variant === "primary" ? "neutralBase-30" : color === "base" ? "primaryBase" : "complimentBase"}
            size="body"
            weight="regular">
            {children}
          </Typography.Text>
        )}
        {undefined !== iconRight && <View style={styles.icon}>{iconRight}</View>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 8 / 2,
  },
});

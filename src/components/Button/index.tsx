import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface ButtonProps extends Omit<PressableProps, "children" | "disabled" | "style"> {
  block?: boolean;
  children?: string | React.ReactNode;
  color?: "base" | "alt";
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  type?: "has icons" | "no icons" | "loader";
  variant?: "primary" | "secondary" | "tertiary";
}

export default function Button({
  block = false,
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
      paddingHorizontal: type === "has icons" ? theme.spacing["8p"] : theme.spacing["16p"],
      paddingVertical: theme.spacing["16p"],
    }),
    [type, variant]
  );

  return (
    <Pressable {...restProps} disabled={disabled} style={block && styles.containerBlock}>
      <View style={[styles.container, containerStyles, { opacity: disabled ? 0.5 : 1 }]}>
        {undefined !== iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        {type === "loader" ? (
          <ActivityIndicator color="white" size="small" />
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
  containerBlock: {
    alignSelf: "stretch",
  },
  icon: {
    marginHorizontal: 8,
  },
});

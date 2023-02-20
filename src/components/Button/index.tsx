import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ButtonProps extends Omit<PressableProps, "children" | "disabled" | "style"> {
  block?: boolean;
  children?: string | React.ReactNode;
  color?: "light" | "dark";
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "warning";
}

export default function Button({
  block = false,
  children,
  color = "light",
  iconLeft,
  disabled,
  iconRight,
  loading = false,
  variant = "primary",
  ...restProps
}: ButtonProps) {
  const containerStyles = useThemeStyles(
    theme => {
      const variance = VARIATIONS[color][variant][disabled ? "disabled" : "enabled"];

      return {
        backgroundColor: theme.palette[variance.backgroundColor],
        borderColor: theme.palette[variance.borderColor],
        borderRadius: theme.radii.extraSmall,
        borderWidth: 2,
        // substract border width. to keep button same dimensions
        paddingHorizontal: theme.spacing["16p"] - 2,
        paddingVertical: theme.spacing["16p"] - 2 + (loading ? 1 : 0),
      };
    },
    [color, disabled, loading, variant]
  );

  const pressedStyle = useThemeStyles(
    theme => {
      const variance = VARIATIONS[color][variant]["pressed"];

      return {
        backgroundColor: theme.palette[variance.backgroundColor],
        borderColor: theme.palette[variance.borderColor],
      };
    },
    [color, variant]
  );

  const androidRippleColor = { color: pressedStyle.backgroundColor, radius: containerStyles.borderRadius };

  return (
    <Pressable
      {...restProps}
      android_ripple={androidRippleColor}
      disabled={disabled}
      style={({ pressed }) => [styles.base, block && styles.block, containerStyles, pressed && pressedStyle]}>
      {({ pressed }) => {
        const state = pressed ? "pressed" : disabled ? "disabled" : "enabled";
        const textColor = VARIATIONS[color][variant][state].textColor;
        const loadingIndicatorColor = useThemeStyles(theme => theme.palette[textColor], [textColor]);

        return (
          <>
            {undefined !== iconLeft && <View style={styles.icon}>{iconLeft}</View>}
            {loading ? (
              <ActivityIndicator color={loadingIndicatorColor} size="small" />
            ) : (
              <Typography.Text color={textColor} size="body" weight="medium">
                {children}
              </Typography.Text>
            )}
            {undefined !== iconRight && <View style={styles.icon}>{iconRight}</View>}
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  block: {
    alignSelf: "stretch",
  },
  icon: {
    marginHorizontal: 8,
  },
});

const VARIATIONS = {
  dark: {
    primary: {
      enabled: {
        backgroundColor: "neutralBase-50",
        borderColor: "neutralBase-50",
        textColor: "primaryBase+10",
      },
      pressed: {
        backgroundColor: "neutralBase-30",
        borderColor: "neutralBase-30",
        textColor: "primaryBase+10",
      },
      disabled: {
        backgroundColor: "primaryBase-30",
        borderColor: "primaryBase-30",
        textColor: "neutralBase-50",
      },
    },
    secondary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase-50",
        textColor: "neutralBase-50",
      },
      pressed: {
        backgroundColor: "primaryBase-30",
        borderColor: "neutralBase-50",
        textColor: "neutralBase-50",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "primaryBase-10",
        textColor: "primaryBase-10",
      },
    },
    tertiary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "neutralBase-50",
      },
      pressed: {
        backgroundColor: "primaryBase-30",
        borderColor: "primaryBase-30",
        textColor: "neutralBase-50",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "primaryBase-10",
      },
    },
    warning: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "errorBase",
      },
      pressed: {
        backgroundColor: "primaryBase-30",
        borderColor: "primaryBase-30",
        textColor: "errorBase",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "primaryBase-10",
      },
    },
  },
  light: {
    primary: {
      enabled: {
        backgroundColor: "primaryBase",
        borderColor: "primaryBase",
        textColor: "neutralBase-50",
      },
      pressed: {
        backgroundColor: "primaryBase+10",
        borderColor: "primaryBase+10",
        textColor: "neutralBase-50",
      },
      disabled: {
        backgroundColor: "primaryBase-30",
        borderColor: "primaryBase-30",
        textColor: "neutralBase-50",
      },
    },
    secondary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "primaryBase",
        textColor: "primaryBase",
      },
      pressed: {
        backgroundColor: "transparent",
        borderColor: "primaryBase+10",
        textColor: "primaryBase+10",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "primaryBase-30",
        textColor: "primaryBase-30",
      },
    },
    tertiary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "primaryBase",
      },
      pressed: {
        backgroundColor: "neutralBase-50",
        borderColor: "neutralBase-50",
        textColor: "primaryBase+10",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "primaryBase-30",
      },
    },
    warning: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "errorBase",
      },
      pressed: {
        backgroundColor: "neutralBase-50",
        borderColor: "neutralBase-50",
        textColor: "errorBase",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "primaryBase-30",
      },
    },
  },
} as const;

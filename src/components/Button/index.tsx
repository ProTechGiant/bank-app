import { cloneElement } from "react";
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface ButtonProps extends Omit<PressableProps, "children" | "disabled" | "style"> {
  block?: boolean;
  children?: string | React.ReactNode;
  color?: "light" | "dark";
  disabled?: boolean;
  iconLeft?: React.ReactElement<SvgProps | IconProps>;
  iconRight?: React.ReactElement<SvgProps | IconProps>;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "warning" | "primary-warning" | "quaternary";
  size?: "regular" | "small" | "mini";
  withBorderWidth?: boolean;
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
  size = "regular",
  withBorderWidth = true,
  ...restProps
}: ButtonProps) {
  const containerStyles = useThemeStyles(
    theme => {
      const variance = VARIATIONS[color][variant][disabled ? "disabled" : "enabled"];

      return {
        backgroundColor: theme.palette[variance.backgroundColor],
        borderColor: theme.palette[variance.borderColor],
        borderRadius: theme.radii.xxlarge,
        borderWidth: withBorderWidth ? BORDER_WIDTH : 0,
        paddingHorizontal: theme.spacing["16p"] - 2,
        paddingVertical:
          (size === "regular" ? theme.spacing["16p"] : size === "small" ? theme.spacing["12p"] : theme.spacing["4p"]) -
          BORDER_WIDTH + // subtract border width to keep button same dimensions,
          (loading ? 1 : 0), // subtract for loading icon
      };
    },
    [color, disabled, loading, variant, size]
  );

  const pressedStyle = useThemeStyles(
    theme => {
      const variance = VARIATIONS[color][variant].pressed;

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
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      android_ripple={androidRippleColor}
      disabled={disabled}
      style={({ pressed }) => [styles.base, block && styles.block, containerStyles, pressed && pressedStyle]}>
      {({ pressed }) => {
        const state = pressed ? "pressed" : disabled ? "disabled" : "enabled";
        const textColor = VARIATIONS[color][variant][state].textColor;

        // false positive: we're inside a child component defined inline
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const textColorRaw = useThemeStyles(theme => theme.palette[textColor], [textColor]);

        return (
          <>
            {undefined !== iconLeft && (
              <View style={styles.icon}>{cloneElement(iconLeft, { color: textColorRaw })}</View>
            )}
            {loading ? (
              <ActivityIndicator color={textColorRaw} size="small" />
            ) : (
              <Typography.Text color={textColor} size="body" weight={variant === "tertiary" ? "semiBold" : "medium"}>
                {children}
              </Typography.Text>
            )}
            {undefined !== iconRight && (
              <View style={styles.icon}>{cloneElement(iconRight, { color: textColorRaw })}</View>
            )}
          </>
        );
      }}
    </Pressable>
  );
}

const BORDER_WIDTH = 2;

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
        backgroundColor: "neutralBase-60",
        borderColor: "neutralBase-60",
        textColor: "neutralBase+30",
      },
      pressed: {
        backgroundColor: "neutralBase-30",
        borderColor: "neutralBase-30",
        textColor: "neutralBase+30",
      },
      disabled: {
        backgroundColor: "neutralBase+20",
        borderColor: "neutralBase+20",
        textColor: "neutralBase+10",
      },
    },
    secondary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase-60",
        textColor: "neutralBase-60",
      },
      pressed: {
        backgroundColor: "neutralBaseHover",
        borderColor: "neutralBase-60",
        textColor: "neutralBase-60",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase+20",
        textColor: "neutralBase+10",
      },
    },
    tertiary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "neutralBase-60",
      },
      pressed: {
        backgroundColor: "neutralBaseHover",
        borderColor: "neutralBaseHover",
        textColor: "neutralBase-60",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "neutralBase+10",
      },
    },
    warning: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "errorBase-10",
      },
      pressed: {
        backgroundColor: "neutralBaseHover",
        borderColor: "neutralBaseHover",
        textColor: "errorBase-10",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "neutralBase+10",
      },
    },
    "primary-warning": {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "errorBase-10",
        textColor: "errorBase-10",
      },
      pressed: {
        backgroundColor: "neutralBaseHover",
        borderColor: "errorBase-10",
        textColor: "errorBase-10",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase+10",
        textColor: "neutralBase+10",
      },
    },
    quaternary: {
      enabled: {
        backgroundColor: "complimentBase",
        borderColor: "primaryBase-70",
        textColor: "neutralBase+30",
      },
      pressed: {
        backgroundColor: "primaryBase-80",
        borderColor: "primaryBase-80",
        textColor: "neutralBase+30",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase+10",
        textColor: "neutralBase+10",
      },
    },
  },
  light: {
    primary: {
      enabled: {
        backgroundColor: "primaryBase",
        borderColor: "primaryBase",
        textColor: "neutralBase-60",
      },
      pressed: {
        backgroundColor: "neutralBaseHover",
        borderColor: "neutralBaseHover",
        textColor: "neutralBase-60",
      },
      disabled: {
        backgroundColor: "neutralBase-40",
        borderColor: "neutralBase-40",
        textColor: "neutralBase-20",
      },
    },
    secondary: {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "primaryBase",
        textColor: "primaryBase",
      },
      pressed: {
        backgroundColor: "neutralBase-50",
        borderColor: "neutralBaseHover",
        textColor: "neutralBaseHover",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase-40",
        textColor: "neutralBase-20",
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
        textColor: "primaryBase",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "neutralBase-20",
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
        textColor: "neutralBase-20",
      },
    },
    "primary-warning": {
      enabled: {
        backgroundColor: "transparent",
        borderColor: "errorBase",
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
        textColor: "neutralBase-20",
      },
    },
    quaternary: {
      enabled: {
        backgroundColor: "primaryBase-70",
        borderColor: "primaryBase-70",
        textColor: "neutralBase+30",
      },
      pressed: {
        backgroundColor: "primaryBase-80",
        borderColor: "primaryBase-80",
        textColor: "neutralBase+30",
      },
      disabled: {
        backgroundColor: "transparent",
        borderColor: "neutralBase+10",
        textColor: "neutralBase+10",
      },
    },
  },
} as const;

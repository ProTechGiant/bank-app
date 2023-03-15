import { cloneElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { CloseIcon, IconProps } from "@/assets/icons";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import Typography from "../Typography";

const lightColor = "neutralBase-50";
const darkColor = "neutralBase+30";

interface Colors {
  text: keyof typeof palette;
  labelText?: keyof typeof palette;
  labelBackground: keyof typeof palette;
  bannerBorderColor?: keyof typeof palette;
}

const getColor = (color: keyof typeof palette): Colors => {
  const colors: { [key: string]: Colors } = {
    "interactionBase-30": {
      text: darkColor,
      labelText: darkColor,
      labelBackground: "interactionBase-20",
      bannerBorderColor: "primaryBase-40",
    },
    successBase: { text: lightColor, labelBackground: "successBase+20" },
    "successBase-30": { text: darkColor, labelBackground: "successBase-20" },
    warningBase: { text: darkColor, labelBackground: "warningBase-10" },
    "warningBase-30": { text: darkColor, labelBackground: "warningBase-20" },
    errorBase: { text: lightColor, labelBackground: "errorBase+10" },
    "errorBase-40": { text: darkColor, labelBackground: "errorBase-20" },
    default: {
      text: lightColor,
      labelText: darkColor,
      labelBackground: "interactionBase-30",
      bannerBorderColor: "primaryBase-40",
    },
  };

  return colors[color] || colors.default;
};

export type BannerColorType =
  | "interactionBase"
  | "interactionBase-30"
  | "successBase"
  | "successBase-30"
  | "warningBase"
  | "warningBase-30"
  | "errorBase"
  | "errorBase-40";

export interface BannerProps {
  variant: BannerColorType;
  icon: React.ReactElement<SvgProps | IconProps>;
  message: string;
  label?: string;
  onClear?: () => void;
  clearTestID?: string;
}

const Banner = ({ variant = "interactionBase", icon: Icon, message, label, onClear, clearTestID }: BannerProps) => {
  const colors = getColor(variant);

  const container = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: theme.palette[variant],
      borderRadius: theme.radii.extraSmall,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      borderColor: colors.bannerBorderColor ? theme.palette[colors.bannerBorderColor] : "transparent",
      borderWidth: 1,
    }),
    [variant]
  );

  const iconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: 32,
      width: 32,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-start",
      marginRight: theme.spacing["16p"],
    }),
    []
  );

  const clearStyle = useThemeStyles<ViewStyle>(
    theme => ({
      height: 32,
      width: 32,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-start",
      marginLeft: theme.spacing["16p"],
    }),
    []
  );

  const labelStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette[colors.labelBackground],
      borderRadius: theme.radii.xxlarge,
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["8p"],
      minWidth: 40,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-start",
    }),
    [colors]
  );

  const iconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.accordian, []);
  const iconColorVar = colors.bannerBorderColor ? colors.bannerBorderColor : colors.text;

  return (
    <View style={container}>
      <View style={iconStyle}>
        {cloneElement(Icon, {
          height: iconDimensions,
          width: iconDimensions,
          color: useThemeStyles<string>(theme => theme.palette[iconColorVar], [colors]),
        })}
      </View>
      <View style={styles.messageStyle}>
        <Typography.Text size="callout" color={colors.text}>
          {message}
        </Typography.Text>
      </View>
      {label && (
        <View style={labelStyle}>
          <Typography.Text size="footnote" color={colors.labelText ? colors.labelText : colors.text}>
            {label}
          </Typography.Text>
        </View>
      )}
      {onClear && (
        <View style={clearStyle}>
          <Pressable onPress={onClear} testID={clearTestID}>
            <CloseIcon color={useThemeStyles<string>(theme => theme.palette[colors.text], [colors])} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  messageStyle: {
    flex: 1,
  },
});

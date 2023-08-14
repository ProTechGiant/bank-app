import React, { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { useListContext } from "../context/ListContext";
import { useInfoStyles } from "../styling";

export interface CategoryListItemProps {
  label: string;
  helperText?: string;
  onMoreInfoPress?: () => void;
  end: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  iconBackground?: keyof typeof palette;
  onPress?: () => void;
}

export default function CategoryListItem({
  label,
  helperText,
  iconBackground,
  onPress,
  onMoreInfoPress,
  icon,
  end,
}: CategoryListItemProps) {
  const variant = useListContext();

  const { infoIconStyle, infoColor } = useInfoStyles();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    backgroundColor: variant === "dark" ? theme.palette["primaryBase-70-8%"] : "transparent",
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const iconBackgroundStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: iconBackground !== undefined ? theme.palette[iconBackground] : "transparent",
      width: 44,
      height: 44,
      borderRadius: 44 / 2,
      alignItems: "center",
      justifyContent: "center",
    }),
    [iconBackground]
  );

  const iconProps = {
    width: 20,
    height: 20,
  };

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  return (
    <Stack
      direction="horizontal"
      align="center"
      justify="space-between"
      gap="12p"
      as={Pressable}
      onPress={onPress}
      style={containerStyle}>
      {icon !== undefined ? (
        <View style={iconBackgroundStyle}>
          {cloneElement(icon, { ...iconProps, color: icon.props.color ?? iconColor })}
        </View>
      ) : null}
      <Stack direction="vertical" gap="4p" flex={1}>
        <Stack direction="horizontal" align="center">
          <Typography.Text
            color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout"
            weight="medium">
            {label}
          </Typography.Text>
          {onMoreInfoPress !== undefined ? (
            <Pressable onPress={onMoreInfoPress} style={infoIconStyle}>
              <InfoCircleIcon color={infoColor} width={20} height={20} />
            </Pressable>
          ) : null}
        </Stack>
        {helperText !== undefined ? (
          <View style={helperTextStyle}>
            <Typography.Text color="neutralBase" size="footnote">
              {helperText}
            </Typography.Text>
          </View>
        ) : null}
      </Stack>
      {end}
    </Stack>
  );
}

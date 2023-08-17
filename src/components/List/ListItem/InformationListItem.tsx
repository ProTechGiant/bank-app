import React, { cloneElement } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { useListContext } from "../context/ListContext";

export interface InformationListItemProps {
  label: string;
  caption?: string;
  helperText?: string;
  onMoreInfoPress?: () => void;
  end: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  iconBackground?: keyof typeof palette;
  onPress?: () => void;
  disabled?: boolean;
}

export default function InformationListItem({
  label,
  caption,
  onPress,
  icon,
  iconBackground,
  end,
  disabled,
}: InformationListItemProps) {
  const variant = useListContext();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
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
        {caption !== undefined ? (
          <Typography.Text color={variant === "dark" ? "neutralBase-20" : "neutralBase"} size="footnote">
            {caption}
          </Typography.Text>
        ) : null}
        <Stack direction="horizontal" align="center">
          <Typography.Text
            color={disabled ? "neutralBase-10" : variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
            size="callout">
            {label}
          </Typography.Text>
        </Stack>
      </Stack>
      {end}
    </Stack>
  );
}

const iconProps = {
  width: 20,
  height: 20,
};

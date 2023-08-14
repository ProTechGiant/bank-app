import React, { cloneElement } from "react";
import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps, InfoCircleIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useListContext } from "../context/ListContext";
import { useInfoStyles } from "../styling";

export interface PrimaryListItemProps {
  label: string;
  helperText?: string;
  onMoreInfoPress?: () => void;
  end?: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  onPress?: () => void;
}

export default function PrimaryListItem({
  label,
  helperText,
  onPress,
  onMoreInfoPress,
  icon,
  end,
}: PrimaryListItemProps) {
  const variant = useListContext();
  const { infoIconStyle, infoColor } = useInfoStyles();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const iconProps = {
    width: 24,
    height: 24,
  };

  return (
    <Stack
      direction="horizontal"
      align="center"
      justify="space-between"
      gap="16p"
      as={Pressable}
      onPress={onPress}
      style={containerStyle}>
      {icon !== undefined ? cloneElement(icon, { ...iconProps, color: icon.props.color ?? iconColor }) : null}
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
          <Typography.Text color="neutralBase" size="footnote">
            {helperText}
          </Typography.Text>
        ) : null}
      </Stack>
      {end}
    </Stack>
  );
}

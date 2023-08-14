import { useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { useListContext } from "../context/ListContext";

export interface FinanceTableListItemProps {
  label: string;
  labelPosition?: "top" | "bottom";
  labelHasBorder?: boolean;
  helperText?: string;
  helperTextColor?: keyof typeof palette;
  expandable: boolean;
  showBody: boolean;
  children: JSX.Element | JSX.Element[];
}

export default function FinanceTableListItem({
  label,
  labelPosition = "top",
  labelHasBorder,
  helperText,
  helperTextColor = "neutralBase",
  expandable,
  showBody,
  children,
}: FinanceTableListItemProps) {
  const variant = useListContext();

  const [isExpanded, setIsExpanded] = useState(showBody);

  const handleOnPress = () => {
    if (expandable) {
      setIsExpanded(prevIsExpanded => !prevIsExpanded);
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
  }));

  const labelContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      ...(labelHasBorder
        ? {
            padding: theme.spacing["16p"],
            borderTopWidth: labelPosition === "top" || !isExpanded ? 0 : 1,
            borderBottomWidth: labelPosition === "bottom" || !isExpanded ? 0 : 1,
            borderColor: theme.palette["neutralBase-30"],
          }
        : {
            paddingHorizontal: theme.spacing["16p"],
            paddingTop: labelPosition === "top" ? theme.spacing["16p"] : theme.spacing["4p"],
            paddingBottom: labelPosition === "bottom" ? theme.spacing["16p"] : theme.spacing["4p"],
          }),
    }),
    [labelHasBorder, labelPosition, isExpanded]
  );

  const contentStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingHorizontal: theme.spacing["16p"],
      paddingTop: !labelHasBorder && labelPosition === "top" ? 0 : theme.spacing["16p"],
      paddingbottom: !labelHasBorder && labelPosition === "bottom" ? 0 : theme.spacing["16p"],
    }),
    [labelHasBorder, labelPosition]
  );

  const renderLabel = (
    <Stack
      direction="horizontal"
      align="center"
      justify="space-between"
      gap="16p"
      as={Pressable}
      onPress={handleOnPress}
      style={labelContainerStyle}>
      <Stack direction="vertical" justify="center" gap="4p" flex={1}>
        <Typography.Text
          color={variant === "dark" ? "neutralBase-60" : "neutralBase+30"}
          size="callout"
          weight="medium">
          {label}
        </Typography.Text>
        {helperText !== undefined ? (
          <Typography.Text color={helperTextColor} size="footnote">
            {helperText}
          </Typography.Text>
        ) : null}
      </Stack>
    </Stack>
  );

  return (
    <View style={containerStyle}>
      {labelPosition === "top" ? renderLabel : null}
      {isExpanded && <View style={contentStyle}>{children}</View>}
      {labelPosition === "bottom" ? renderLabel : null}
    </View>
  );
}

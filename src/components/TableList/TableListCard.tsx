import React, { cloneElement, createElement, Fragment } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { WithShadow } from "@/components";
import { useThemeStyles } from "@/theme";

import { Chevron, Copy, Label, TableListDate, TableListDay, TableListToggle } from "./EndComponents";
import TableListCardBody from "./TableListCardBody";

export interface TableListCardProps {
  label: string;
  helperText?: string;
  onInfoPress?: () => void;
  isError?: boolean;
  end?: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  isGrouped?: boolean;
  onPress?: () => void;
}

TableListCard.Copy = Copy;
TableListCard.Chevron = Chevron;
TableListCard.Label = Label;
TableListCard.Date = TableListDate;
TableListCard.Day = TableListDay;
TableListCard.Toggle = TableListToggle;

export default function TableListCard({
  helperText,
  label,
  onInfoPress,
  onPress,
  icon,
  isError,
  isGrouped = false,
  end,
}: TableListCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    padding: theme.spacing["16p"],
    justifyContent: "space-between",
  }));

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    marginRight: theme.spacing["16p"],
  }));

  const children = (
    <Pressable onPress={onPress} style={containerStyle}>
      {icon !== undefined ? (
        <View style={listContainerStyle}>{cloneElement(icon, { color: icon.props.color ?? iconColor })}</View>
      ) : null}
      <TableListCardBody helperText={helperText} isError={isError} label={label} onInfoPress={onInfoPress} />
      {end}
    </Pressable>
  );
  return !isGrouped
    ? createElement(WithShadow, { backgroundColor: "neutralBase-60", borderRadius: "small", children: children })
    : createElement(Fragment, { children: children });
}

import React, { cloneElement, createElement, Fragment } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { Theme, useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import { Chevron, Copy, Label, TableListDate, TableListDay, TableListToggle } from "./EndComponents";
import TableListCardBody from "./TableListCardBody";

export interface TableListCardProps {
  background?: "dark" | "light";
  caption?: string;
  label: string;
  helperText?: string;
  onInfoPress?: () => void;
  isError?: boolean;
  end?: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  iconBackground?: keyof typeof palette;
  isGrouped?: boolean;
  onPress?: () => void;
  isInactive?: boolean;
  labelSize?: keyof Theme["typography"]["text"]["sizes"]; //To accomodate the new design changes
  labelWeight?: keyof Theme["typography"]["text"]["weights"];
}

TableListCard.Copy = Copy;
TableListCard.Chevron = Chevron;
TableListCard.Label = Label;
TableListCard.Date = TableListDate;
TableListCard.Day = TableListDay;
TableListCard.Toggle = TableListToggle;

function TableListCard({
  background,
  caption,
  helperText,
  label,
  onInfoPress,
  onPress,
  icon,
  iconBackground,
  isError,
  isGrouped = false,
  end,
  isInactive,
  labelSize = "callout",
  labelWeight = "medium",
}: TableListCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["16p"],
    justifyContent: "space-between",
  }));

  const containerBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: background === "dark" ? theme.palette["primaryBase-70-8%"] : theme.palette["neutralBase-60"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    marginRight: theme.spacing["12p"],
  }));

  const iconBackgroundStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: iconBackground !== undefined ? theme.palette[iconBackground] : undefined,
      width: 44,
      height: 44,
      borderRadius: 44 / 2,
      alignItems: "center",
      justifyContent: "center",
    }),
    [iconBackground]
  );

  const borderContainer = useThemeStyles<ViewStyle>(theme => ({
    borderColor: background === "dark" ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
    backgroundColor: background === "dark" ? "primaryBase-70-8%" : "neutralBase-60",
    borderWidth: 1,
    borderRadius: theme.radii.small,
  }));

  const children = (
    <Pressable onPress={onPress} style={containerStyle}>
      {icon !== undefined ? (
        <View style={[listContainerStyle, iconBackground !== undefined && iconBackgroundStyle]}>
          {cloneElement(icon, { color: icon.props.color ?? iconColor })}
        </View>
      ) : null}
      <TableListCardBody
        background={background}
        caption={caption}
        helperText={helperText}
        isError={isError}
        label={label}
        onInfoPress={onInfoPress}
        isInactive={isInactive}
        labelSize={labelSize}
        labelWeight={labelWeight}
      />
      {end}
    </Pressable>
  );

  return !isGrouped ? (
    <View style={[borderContainer, background !== undefined && containerBackgroundStyle]}>
      {createElement(Fragment, {
        children: children,
      })}
    </View>
  ) : (
    createElement(Fragment, { children: children })
  );
}

export default TableListCard;

import { cloneElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

import { Chevron, Copy, Label, TableListDate, TableListToggle } from "./EndComponents";
import { styles } from "./Styles";
import TableListCardBody from "./TableListCardBody";

export interface TableListCardProps {
  label?: string;
  helperText?: string;
  onInfoPress?: () => void;
  onChevronPress?: () => void;
  isTransparent?: boolean;
  end?: React.ReactNode;
  icon?: React.ReactElement<SvgProps | IconProps>;
  position?: "alone" | "first" | "last" | "middle";
  onPress?: () => void;
}

TableListCard.Copy = Copy;
TableListCard.Chevron = Chevron;
TableListCard.Label = Label;
TableListCard.Date = TableListDate;
TableListCard.Toggle = TableListToggle;

export default function TableListCard({
  helperText,
  label,
  onInfoPress,
  onPress,
  icon,
  isTransparent,
  position = "alone",
  end,
}: TableListCardProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: isTransparent ? "transparent" : theme.palette["neutralBase-60"],
      borderTopStartRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderTopEndRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderBottomStartRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      borderBottomEndRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      flexDirection: "row",
      minHeight: 54,
      paddingHorizontal: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [position]
  );

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    marginRight: theme.spacing["16p"],
  }));

  return (
    <View style={[containerStyle, position === "alone" && s.shadow]}>
      {icon !== undefined ? <View style={listContainerStyle}>{cloneElement(icon, { color: iconColor })}</View> : null}
      <TableListCardBody helperText={helperText} label={label} onInfoPress={onInfoPress} onPress={onPress} />
      <View style={styles.rightComponent}>{end}</View>
    </View>
  );
}

const s = StyleSheet.create({
  shadow: {
    elevation: 5,
    shadowColor: "rgb(40, 47, 134)",
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

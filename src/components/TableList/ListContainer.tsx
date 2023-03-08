import { View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { TableListProps } from "./TableListCard";
import TableListCardBody from "./TableListCardBody";

export default function ListContainer({
  helperText,
  label,
  onInfoPress,
  onPress,
  children,
  icon,
  isTransparent = false,
  position = "alone",
}: TableListProps & ViewProps) {
  const containerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignContent: "center",
      backgroundColor: isTransparent ? "transparent" : theme.palette["neutralBase-50"],
      borderTopStartRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderTopEndRadius: position === "alone" || position === "first" ? theme.radii.small : undefined,
      borderBottomStartRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      borderBottomEndRadius: position === "alone" || position === "last" ? theme.radii.small : undefined,
      flexDirection: "row",
      paddingHorizontal: theme.spacing["16p"],
      paddingVertical: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [position]
  );
  const listContainer = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    marginRight: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      {icon !== undefined ? <View style={listContainer}>{icon}</View> : null}
      <TableListCardBody helperText={helperText} label={label} onInfoPress={onInfoPress} onPress={onPress} />
      {children}
    </View>
  );
}

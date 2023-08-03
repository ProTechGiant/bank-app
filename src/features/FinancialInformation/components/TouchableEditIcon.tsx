import React from "react";
import { Pressable, ViewStyle } from "react-native";

import { EditIcon } from "@/assets/icons";
import { useThemeStyles } from "@/theme";

interface TouchableEditIconProps {
  onPress: () => void;
  height?: number;
  width?: number;
}

export default function TouchableEditIcon({ onPress, height = 15, width = 15 }: TouchableEditIconProps) {
  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const editIconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={onPress} style={iconContainerStyle}>
      <EditIcon color={editIconColor} height={height} width={width} />
    </Pressable>
  );
}

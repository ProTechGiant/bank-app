import React from "react";
import { Pressable } from "react-native";

import { EditIcon } from "@/assets/icons";
import { palette } from "@/theme/values";

interface TouchableEditIconProps {
  onPress: () => void;
  height?: number;
  width?: number;
}

export default function TouchableEditIcon({ onPress, height = 15, width = 15 }: TouchableEditIconProps) {
  return (
    <Pressable onPress={onPress}>
      <EditIcon color={palette["primaryBase-40"]} height={height} width={width} />
    </Pressable>
  );
}

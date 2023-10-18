import React from "react";
import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function CheckCircleIcon({ height = 12, width = 12, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10ZM8.295 3.79L5 7.085L3.705 5.795L3 6.5L5 8.5L9 4.5L8.295 3.79Z"
        fill={color}
      />
    </Svg>
  );
}

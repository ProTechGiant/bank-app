import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function TickCircleIcon({ color = "#F34C33", height = 80, width = 80 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M40 0C17.92 0 0 17.92 0 40C0 62.08 17.92 80 40 80C62.08 80 80 62.08 80 40C80 17.92 62.08 0 40 0ZM32 60L12 40L17.64 34.36L32 48.68L62.36 18.32L68 24L32 60Z"
        fill={color}
      />
    </Svg>
  );
}

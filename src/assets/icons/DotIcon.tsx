import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function DotIcon({ color = "#CCCCCC", height = 20, width = 20 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={color}>
      <Path
        d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15Z"
        fill={color}
      />
    </Svg>
  );
}

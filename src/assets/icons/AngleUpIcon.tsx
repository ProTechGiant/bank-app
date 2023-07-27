import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function AngleUpIcon({ color = "#B3B3B3", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M12 8.795l-6 6 1.41 1.41 4.59-4.58 4.59 4.58 1.41-1.41-6-6z" fill={color} />
    </Svg>
  );
}

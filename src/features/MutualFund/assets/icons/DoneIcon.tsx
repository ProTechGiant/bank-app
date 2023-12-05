import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function DoneIcon({ width = 18, height = 18, color = "#fff" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M6.6 11.925l-3.15-3.15-1.05 1.05 4.2 4.2 9-9-1.05-1.05-7.95 7.95z" fill={color} />
    </Svg>
  );
}

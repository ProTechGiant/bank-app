import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function NeraLogo({ width = 63, height = 73, color = "#F34C33" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 63 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M59.6001 12.0517L62.9948 10.0927V62.9125L59.6001 60.943L45.5474 52.8041V72.9948L0 46.6136L3.42074 44.6442L17.463 36.5052L45.5526 52.7779V20.2116L17.4526 36.4948L3.42074 28.3715L0 26.3916L45.5526 0V20.1907L59.6053 12.0517H59.6001Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function HomeTabIcon({ width = 25, height = 24, color = "#666666" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="home">
        <Path id="Vector" d="M4.96484 21V9L12.9648 3L20.9648 9V21H14.9648V14H10.9648V21H4.96484Z" fill={color} />
      </G>
    </Svg>
  );
}

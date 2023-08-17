import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function HomeIcon({ width = 24, height = 24, color = "#666666" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="home">
        <Path id="Vector" d="M6 19H9V13H15V19H18V10L12 5.5L6 10V19ZM4 21V9L12 3L20 9V21H13V15H11V21H4Z" fill={color} />
      </G>
    </Svg>
  );
}

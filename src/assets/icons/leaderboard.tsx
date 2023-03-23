import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function LeaderBoard({ width = 24, height = 24, color = "#FF7512" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M16 11V3H8V9H2V21H22V11H16ZM10 5H14V19H10V5ZM4 11H8V19H4V11ZM20 19H16V13H20V19Z" fill={color} />
    </Svg>
  );
}

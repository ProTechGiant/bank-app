import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function NoRiskIcon({ width = 24, height = 24, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 12.5C22 13.0523 21.5523 13.5 21 13.5H3C2.44772 13.5 2 13.0523 2 12.5C2 11.9477 2.44772 11.5 3 11.5H21C21.5523 11.5 22 11.9477 22 12.5Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function NoRiskIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        id="Vector"
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill={color}
      />
      <Path
        id="Vector_2"
        d="M16.935 12H7.065C7.0291 12 7 12.0291 7 12.065C7 12.1009 7.0291 12.13 7.065 12.13H16.935C16.9709 12.13 17 12.1009 17 12.065C17 12.0291 16.9709 12 16.935 12Z"
        fill={color}
        stroke={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ImproveQualityIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M22 7.93L20.59 6.52L16.56 11.05L9.5 4.5L2 12.01L3.5 13.51L9.64 7.36L15.23 12.54L13.5 14.49L9.5 10.49L2 18L3.5 19.5L9.5 13.49L13.5 17.49L16.69 13.9L20.59 17.51L22 16.1L18.02 12.4L22 7.93Z"
        fill={color}
      />
    </Svg>
  );
}

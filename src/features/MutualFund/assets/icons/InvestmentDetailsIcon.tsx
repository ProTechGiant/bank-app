import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function InvestmentDetailsIcon({ width = 24, height = 25, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path
        d="M14.06 10.69L12 9.75L14.06 8.81L15 6.75L15.94 8.81L18 9.75L15.94 10.69L15 12.75L14.06 10.69ZM4 14.75L4.94 12.69L7 11.75L4.94 10.81L4 8.75L3.06 10.81L1 11.75L3.06 12.69L4 14.75ZM8.5 9.75L9.59 7.34L12 6.25L9.59 5.16L8.5 2.75L7.41 5.16L5 6.25L7.41 7.34L8.5 9.75ZM4.5 21.25L10.5 15.24L14.5 19.24L23 9.68L21.59 8.27L14.5 16.24L10.5 12.24L3 19.75L4.5 21.25Z"
        fill={color}
      />
    </Svg>
  );
}

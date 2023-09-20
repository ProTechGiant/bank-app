import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function OnlineTransactionLimitIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18.36 9L18.96 12H5.04L5.64 9H18.36ZM20 4H4V6H20V4ZM20 7H4L3 12V14H4V20H14V14H18V20H20V14H21V12L20 7ZM6 18V14H12V18H6Z"
        fill={color}
      />
    </Svg>
  );
}

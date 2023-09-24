import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LowRiskIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        id="Vector"
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill={color}
      />
      <Path
        id="path"
        d="M8.04714 16.0471C8.29856 15.67 8.61283 15.3557 8.98995 15.1043C9.36707 14.8529 9.68134 14.5386 9.93276 14.1615C10.1842 13.7844 10.4984 13.4701 10.8756 13.2187C11.2527 12.9673 11.567 12.653 11.8184 12.2759C12.0698 11.8988 12.3841 11.5845 12.7612 11.3331C13.1383 11.0817 13.4526 10.7674 13.704 10.3903C13.9554 10.0132 14.2697 9.69889 14.6468 9.44748C15.0239 9.19606 15.3382 8.88179 15.5896 8.50467C15.841 8.12754 16.1553 7.81327 16.5324 7.56186"
        stroke={color}
        stroke-linecap="round"
      />
    </Svg>
  );
}

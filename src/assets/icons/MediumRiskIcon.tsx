import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function MediumRiskIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        id="Vector"
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill={color}
      />
      <Path
        id="path"
        d="M7.43041 16.8106C7.53627 15.5615 8.216 14.9388 9.46961 14.9424C10.7232 14.9461 11.403 14.3234 11.5088 13.0742C11.6147 11.8251 12.2944 11.2024 13.548 11.206C14.8016 11.2097 15.4814 10.587 15.5872 9.33782C15.6931 8.08869 16.3728 7.46595 17.6264 7.46962"
        stroke={color}
        stroke-linecap="round"
      />
    </Svg>
  );
}

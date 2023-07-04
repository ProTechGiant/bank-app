import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TravelIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M21.5 16V14L13.5 9V3.5C13.5 2.67 12.83 2 12 2C11.17 2 10.5 2.67 10.5 3.5V9L2.5 14V16L10.5 13.5V19L8.5 20.5V22L12 21L15.5 22V20.5L13.5 19V13.5L21.5 16Z"
        fill={color}
      />
    </Svg>
  );
}

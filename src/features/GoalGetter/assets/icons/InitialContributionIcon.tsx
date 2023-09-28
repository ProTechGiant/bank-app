import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function InitialContributionIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M14.59 7.41L18.17 11H6V13H18.17L14.58 16.59L16 18L22 12L16 6L14.59 7.41ZM2 6V18H4V6H2Z" fill={color} />
    </Svg>
  );
}

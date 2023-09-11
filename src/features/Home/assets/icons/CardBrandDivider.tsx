import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CardBrandDivider({ width = 350, height = 24, color = "#F2F2F2" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 350 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 0l350 15.198V24H0V0z" fill={color} />
    </Svg>
  );
}

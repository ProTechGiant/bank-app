import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const LightningBoltIcon = ({ width = 12, height = 18, color = "#FF7512" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 12 18" fill={color} xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M4.99558 18H3.99558L4.99558 11H1.49558C0.615577 11 1.16558 10.25 1.18558 10.22C2.47558 7.94 4.41558 4.54 7.00558 0H8.00558L7.00558 7H10.5156C10.9156 7 11.1356 7.19 10.9156 7.66C6.96558 14.55 4.99558 18 4.99558 18Z"
      fill={color}
    />
  </Svg>
);

export { LightningBoltIcon };

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const CardIcon = ({ width = 20, height = 17, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M20 0.5H0V16.5H20V0.5ZM18 14.5H2V8.5H18V14.5ZM18 4.5H2V2.5H18V4.5Z" fill={color} />
  </Svg>
);

export { CardIcon };

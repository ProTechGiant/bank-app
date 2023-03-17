import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const CardIcon = ({ width = 24, height = 25, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M22 4.5H2V20.5H22V4.5ZM20 18.5H4V12.5H20V18.5ZM20 8.5H4V6.5H20V8.5Z" fill={color} />
  </Svg>
);

export { CardIcon };

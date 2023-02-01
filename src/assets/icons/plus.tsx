import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const PlusIcon = ({ width = 14, height = 14, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill={color} />
  </Svg>
);

export { PlusIcon };

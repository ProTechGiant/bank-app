import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const PlusIcon = ({ width = 24, height = 24, color = "#FAFAFA" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill={color} />
  </Svg>
);

export { PlusIcon };

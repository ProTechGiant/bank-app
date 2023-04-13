import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const LocalTransferIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <Path d="M9.5 4.5V6.5H16.09L4.5 18.09L5.91 19.5L17.5 7.91V14.5H19.5V4.5H9.5Z" fill={color} />
  </Svg>
);

export { LocalTransferIcon };

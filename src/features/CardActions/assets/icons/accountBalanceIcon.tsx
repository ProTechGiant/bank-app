import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const AccountBalanceIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M7 10.5H4V17.5H7V10.5Z" fill={color} />
    <Path d="M13.5 10.5H10.5V17.5H13.5V10.5Z" fill={color} />
    <Path d="M22 19.5H2V22.5H22V19.5Z" fill={color} />
    <Path d="M20 10.5H17V17.5H20V10.5Z" fill={color} />
    <Path d="M12 1.5L2 6.5V8.5H22V6.5L12 1.5Z" fill={color} />
  </Svg>
);

export { AccountBalanceIcon };

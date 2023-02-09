import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const CheckIcon = ({ width = 18, height = 15, color = "black" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 18 15" fill={color} xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M5.8002 11.3998L1.6002 7.1998L0.200195 8.5998L5.8002 14.1998L17.8002 2.1998L16.4002 0.799805L5.8002 11.3998Z"
      fill={color}
    />
  </Svg>
);

export { CheckIcon };

import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";
const RewardsSwitchIcon = ({ width = 15, height = 12 }: IconProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 12" fill="none">
    <Path
      d="M3.325 5.16602L0 8.49935L3.325 11.8327V9.33268H9.16667V7.66602H3.325V5.16602ZM15 3.49935L11.675 0.166016V2.66602H5.83333V4.33268H11.675V6.83268L15 3.49935Z"
      fill="#EC5F48"
    />
  </Svg>
);
export default RewardsSwitchIcon;

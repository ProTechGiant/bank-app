import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function GoalAngledBorder({ width = 24, height = 109, color = "#5DDBFE" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 109" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 109L15.1983 -4.09113e-07L24 -8.27543e-06L24 109L0 109Z" fill={color} />
    </Svg>
  );
}

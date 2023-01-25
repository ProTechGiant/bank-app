import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const InfoFilledCircleIcon = ({ width = 20, height = 20, color = "#FFFFFF" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
      fill={color}
    />
  </Svg>
);

export { InfoFilledCircleIcon };

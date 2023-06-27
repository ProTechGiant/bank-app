import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ReportIcon({ width = 22, height = 19, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M11 3.99L18.53 17H3.47L11 3.99ZM11 0L0 19H22L11 0ZM12 14H10V16H12V14ZM12 8H10V12H12V8Z" fill={color} />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function AngledIcon({ width = 391, height = 30, color = "#1E1A25" }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      width={width}
      height={height}
      viewBox="0 0 391 30"
      fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M390.257 0H0.000183105L0.000183105 22.7089L359.109 29.6024C377.122 29.9482 389.73 15.5695 390.257 0Z"
        fill={color}
      />
    </Svg>
  );
}

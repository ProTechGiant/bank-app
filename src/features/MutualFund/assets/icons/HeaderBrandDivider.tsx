import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function HeaderBrandDivider({ width = 390, height = 54, color = "#1E1A25" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 1 390 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M242.16 53.229L0 22.5V0h390v22.5L317.912 5.604C303.808 2.3 289.243 8.88 282.402 21.65l-8.006 14.945A32 32 0 01242.16 53.23z"
        fill={color}
      />
    </Svg>
  );
}

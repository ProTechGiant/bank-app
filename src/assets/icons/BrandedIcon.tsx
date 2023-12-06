import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function BrandedIcon({ width = 390, height = 56, color = "#1E1A25" }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      width={width}
      height={height}
      viewBox="0 0 390 56"
      fill="none">
      <Path
        d="M242.16 53.2287L0 22.5V0H390V22.5L317.912 5.60433C303.808 2.29878 289.243 8.87995 282.402 21.649L274.396 36.5943C268.135 48.2821 255.314 54.8978 242.16 53.2287Z"
        fill={color}
      />
    </Svg>
  );
}

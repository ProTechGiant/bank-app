import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function CroatiaLogoIcon({ width = 66, height = 68, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 66 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M47.254 18.7539L65.0575 9.32928V58.3222L47.254 48.8976V18.7613V18.7539ZM0.942383 24.5725L18.7458 33.9971L47.1972 18.9252V0.0686035L0.942383 24.5651V24.5725ZM0.942383 43.5036L47.1972 68.0001V49.1435L18.7458 34.0716L0.942383 43.4962V43.5036Z"
        fill={color}
      />
    </Svg>
  );
}

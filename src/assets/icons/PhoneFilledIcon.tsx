import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function PhoneFilledIcon({ width = 18, height = 19, color = "#000000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.7488 12.095L11.7963 11.6375L9.90633 13.5275C7.78383 12.4475 6.04383 10.715 4.96383 8.585L6.86133 6.6875L6.40383 2.75H2.27133C1.83633 10.385 8.11383 16.6625 15.7488 16.2275V12.095Z"
        fill={color}
      />
    </Svg>
  );
}

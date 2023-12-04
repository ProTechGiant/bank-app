import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function DiamondFillIcon({ width = 16, height = 17, color = "#FF523D" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 17" fill="none">
      <Path d="M8.10594 2.7998H7.8926L6.13927 6.2998H9.85927L8.10594 2.7998Z" fill={color} />
      <Path
        d="M10.9726 6.2998H14.4126L13.0326 3.5398C12.8059 3.08647 12.3459 2.7998 11.8393 2.7998H9.21927L10.9726 6.2998Z"
        fill={color}
      />
      <Path d="M14.2526 7.2998H8.49927V14.1998L14.2526 7.2998Z" fill={color} />
      <Path d="M7.49927 14.1998V7.2998H1.74594L7.49927 14.1998Z" fill={color} />
      <Path
        d="M5.02594 6.2998L6.7726 2.7998H4.15927C3.6526 2.7998 3.1926 3.08647 2.96594 3.5398L1.58594 6.2998H5.02594Z"
        fill={color}
      />
    </Svg>
  );
}

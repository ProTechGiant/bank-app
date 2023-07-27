import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function NotificationsLanguageIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14 14v3H6v-7c0-2.21 1.79-4 4-4 .85 0 1.64.26 2.28.72l1.43-1.43A5.87 5.87 0 0011.5 4.2v-.7c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.7C5.91 4.86 4 7.21 4 10v7H2v2h16v-2h-2v-3h-2zm-4 8c1.1 0 2-.9 2-2H8c0 1.1.9 2 2 2zM22 8h-3V5h-2v3h-3v2h3v3h2v-3h3V8z"
        fill={color}
      />
    </Svg>
  );
}

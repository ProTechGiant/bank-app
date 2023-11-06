import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ConnectedServicesIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18.5 8.5H17.5V6.5C17.5 3.74 15.26 1.5 12.5 1.5C9.74 1.5 7.5 3.74 7.5 6.5H9.5C9.5 4.84 10.84 3.5 12.5 3.5C14.16 3.5 15.5 4.84 15.5 6.5V8.5H6.5C5.4 8.5 4.5 9.4 4.5 10.5V20.5C4.5 21.6 5.4 22.5 6.5 22.5H18.5C19.6 22.5 20.5 21.6 20.5 20.5V10.5C20.5 9.4 19.6 8.5 18.5 8.5ZM18.5 20.5H6.5V10.5H18.5V20.5ZM12.5 17.5C13.6 17.5 14.5 16.6 14.5 15.5C14.5 14.4 13.6 13.5 12.5 13.5C11.4 13.5 10.5 14.4 10.5 15.5C10.5 16.6 11.4 17.5 12.5 17.5Z"
        fill={color}
      />
    </Svg>
  );
}

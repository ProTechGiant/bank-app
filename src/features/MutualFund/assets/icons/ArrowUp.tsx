import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ArrowUp({ width = 20, height = 16, color = "#39FDDC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.67457 15.7001C1.24124 15.7001 0.91224 15.5041 0.687574 15.1121C0.46224 14.7208 0.474574 14.3418 0.724574 13.9751L9.02457 0.650098C9.25791 0.283431 9.58291 0.100098 9.99957 0.100098C10.4162 0.100098 10.7412 0.283431 10.9746 0.650098L19.2746 13.9751C19.5246 14.3418 19.5369 14.7208 19.3116 15.1121C19.0869 15.5041 18.7579 15.7001 18.3246 15.7001H1.67457Z"
        fill={color}
      />
    </Svg>
  );
}

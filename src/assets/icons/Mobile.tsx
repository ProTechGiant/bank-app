import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function Mobile({ width = 24, height = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16 1H8C6.34 1 5 2.34 5 4V20C5 21.66 6.34 23 8 23H16C17.66 23 19 21.66 19 20V4C19 2.34 17.66 1 16 1ZM17 18H7V4H17V18ZM14 21H10V20H14V21Z"
        fill={color}
      />
    </Svg>
  );
}

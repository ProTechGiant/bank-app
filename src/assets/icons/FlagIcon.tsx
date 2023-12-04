import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function FlagIcon({ width = 24, height = 24, color = "#FF523D" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.86 5.5L12.26 7.5H17.5V13.5H14.14L13.74 11.5H6.5V5.5H11.86ZM13.5 3.5H4.5V20.5H6.5V13.5H12.1L12.5 15.5H19.5V5.5H13.9L13.5 3.5Z"
        fill={color}
      />
    </Svg>
  );
}

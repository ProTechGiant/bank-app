import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function Info({ width = 16, height = 20, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8 0L0 3V9.09C0 14.14 3.41 18.85 8 20C12.59 18.85 16 14.14 16 9.09V3L8 0ZM9 14H7V12H9V14ZM9 10H7V5H9V10Z"
        fill={color}
      />
    </Svg>
  );
}

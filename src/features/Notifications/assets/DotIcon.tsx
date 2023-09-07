import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function DotIcon({ width = 12, height = 12, color = "#FF371E" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LargeFilledTickIcon({ width = 64, height = 64, color = "#ffffff" }: IconProps) {
  const length: number = +width;

  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx={length / 2} fill="#00AC86" />
      <Path
        d="M27.7268 37.1672L22.1668 31.6072L20.2734 33.4872L27.7268 40.9405L43.7268 24.9405L41.8468 23.0605L27.7268 37.1672Z"
        fill={color}
      />
    </Svg>
  );
}

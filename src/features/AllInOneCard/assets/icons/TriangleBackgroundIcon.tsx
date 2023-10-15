import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TriangleBackgroundIcon({ width = 390, height = 162, color = "#FAFAFA" }: IconProps) {
  const viewBox = `0 0 ${width} ${height}`;
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M0 61.6826C0 48.356 10.0762 37.1871 23.3324 35.8198L361.332 0.956909C376.666 -0.62462 390 11.4052 390 26.8197V136C390 150.359 378.359 162 364 162H26C11.6406 162 0 150.359 0 136V61.6826Z"
        fill={color}
      />
    </Svg>
  );
}

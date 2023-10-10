import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronUpIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.68141e-08 6.29313L1.41 7.70313L6 3.12313L10.59 7.70313L12 6.29313L6 0.293125L1.68141e-08 6.29313Z"
        fill={color}
      />
    </Svg>
  );
}

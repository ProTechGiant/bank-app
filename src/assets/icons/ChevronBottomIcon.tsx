import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronBottomIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 1.70687L10.59 0.296875L6 4.87687L1.41 0.296875L-6.16331e-08 1.70687L6 7.70687L12 1.70687Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function TopUpIcon({ width = 20, height = 20, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3.33398 9.99967L4.50898 11.1747L9.16732 6.52467V16.6663H10.834V6.52467L15.484 11.183L16.6673 9.99967L10.0007 3.33301L3.33398 9.99967Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LoadMoreIcon({ width = 20, height = 20, color = "#808080" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 15" fill="none">
      <Path
        d="M6.00033 3.50016V0.833496L2.66699 4.16683L6.00033 7.50016V4.8335C8.20699 4.8335 10.0003 6.62683 10.0003 8.8335C10.0003 11.0402 8.20699 12.8335 6.00033 12.8335C3.79366 12.8335 2.00033 11.0402 2.00033 8.8335H0.666992C0.666992 11.7802 3.05366 14.1668 6.00033 14.1668C8.94699 14.1668 11.3337 11.7802 11.3337 8.8335C11.3337 5.88683 8.94699 3.50016 6.00033 3.50016Z"
        fill={color}
      />
    </Svg>
  );
}

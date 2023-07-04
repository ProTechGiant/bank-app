import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function SportIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3.81 6.28C2.67 7.9 2 9.87 2 12C2 14.13 2.67 16.1 3.81 17.72C6.23 16.95 8 14.68 8 12C8 9.32 6.23 7.05 3.81 6.28Z"
        fill={color}
      />
      <Path
        d="M20.19 6.28C17.77 7.05 16 9.32 16 12C16 14.68 17.77 16.95 20.19 17.72C21.33 16.1 22 14.13 22 12C22 9.87 21.33 7.9 20.19 6.28Z"
        fill={color}
      />
      <Path
        d="M14 12C14 8.72 15.97 5.91 18.79 4.67C17.01 3.02 14.63 2 12 2C9.37 2 6.99 3.02 5.21 4.67C8.03 5.91 10 8.72 10 12C10 15.28 8.03 18.09 5.21 19.33C6.99 20.98 9.37 22 12 22C14.63 22 17.01 20.98 18.79 19.33C15.97 18.09 14 15.28 14 12Z"
        fill={color}
      />
    </Svg>
  );
}

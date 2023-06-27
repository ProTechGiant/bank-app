import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LockIcon({ width = 24, height = 24, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18 9H17V7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7V9H6C4.9 9 4 9.9 4 11V21C4 22.1 4.9 23 6 23H18C19.1 23 20 22.1 20 21V11C20 9.9 19.1 9 18 9ZM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V9H9V7ZM18 21H6V11H18V21ZM12 18C13.1 18 14 17.1 14 16C14 14.9 13.1 14 12 14C10.9 14 10 14.9 10 16C10 17.1 10.9 18 12 18Z"
        fill={color}
      />
    </Svg>
  );
}

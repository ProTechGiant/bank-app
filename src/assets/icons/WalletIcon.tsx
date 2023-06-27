import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function WalletIcon({ width = 24, height = 24, color = "#FF7512" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20.5 7.28V5C20.5 3.9 19.6 3 18.5 3H4.5C3.39 3 2.5 3.9 2.5 5V19C2.5 20.1 3.39 21 4.5 21H18.5C19.6 21 20.5 20.1 20.5 19V16.72C21.09 16.37 21.5 15.74 21.5 15V9C21.5 8.26 21.09 7.63 20.5 7.28ZM19.5 9V15H12.5V9H19.5ZM4.5 19V5H18.5V7H12.5C11.4 7 10.5 7.9 10.5 9V15C10.5 16.1 11.4 17 12.5 17H18.5V19H4.5Z"
        fill={color}
      />
      <Path
        d="M15.5 13.5C16.3284 13.5 17 12.8284 17 12C17 11.1716 16.3284 10.5 15.5 10.5C14.6716 10.5 14 11.1716 14 12C14 12.8284 14.6716 13.5 15.5 13.5Z"
        fill={color}
      />
    </Svg>
  );
}

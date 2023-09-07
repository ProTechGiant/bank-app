import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function UnLockIcon({ width = 24, height = 24, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18 8.5H17V6.5C17 3.74 14.76 1.5 12 1.5C9.24 1.5 7 3.74 7 6.5H9C9 4.84 10.34 3.5 12 3.5C13.66 3.5 15 4.84 15 6.5V8.5H6C4.9 8.5 4 9.4 4 10.5V20.5C4 21.6 4.9 22.5 6 22.5H18C19.1 22.5 20 21.6 20 20.5V10.5C20 9.4 19.1 8.5 18 8.5ZM18 20.5H6V10.5H18V20.5ZM12 17.5C13.1 17.5 14 16.6 14 15.5C14 14.4 13.1 13.5 12 13.5C10.9 13.5 10 14.4 10 15.5C10 16.6 10.9 17.5 12 17.5Z"
        fill={color}
      />
    </Svg>
  );
}

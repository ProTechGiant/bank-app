import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function MutualFundIcon({ color = "#2E2E2E", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM12 10H8V11H11C11.55 11 12 11.45 12 12V15C12 15.55 11.55 16 11 16H10V17H8V16H6V14H10V13H7C6.45 13 6 12.55 6 12V9C6 8.45 6.45 8 7 8H8V7H10V8H12V10ZM16 16.25L14 14.25H18L16 16.25ZM14 10L16 8L18 10H14Z"
        fill={color}
      />
    </Svg>
  );
}

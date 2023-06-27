import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function BankAccountIcon({ width = 18, height = 19, color = "#000000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3.375 8.375V13.625H5.625V8.375H3.375ZM7.875 8.375V13.625H10.125V8.375H7.875ZM1.875 17.375H16.125V15.125H1.875V17.375ZM12.375 8.375V13.625H14.625V8.375H12.375ZM9 1.625L1.875 5.375V6.875H16.125V5.375L9 1.625Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function NumbersIcon({ width = 18, height = 19, color = "#000000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.375 8L15.75 6.5H12.75L13.5 3.5H12L11.25 6.5H8.25L9 3.5H7.5L6.75 6.5H3.75L3.375 8H6.375L5.625 11H2.625L2.25 12.5H5.25L4.5 15.5H6L6.75 12.5H9.75L9 15.5H10.5L11.25 12.5H14.25L14.625 11H11.625L12.375 8H15.375ZM10.125 11H7.125L7.875 8H10.875L10.125 11Z"
        fill={color}
      />
    </Svg>
  );
}

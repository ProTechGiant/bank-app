import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function AppreciationIcon({ width = 20, height = 20, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.25 3.75H12.9167L7.91667 11.25V14.5833H9.58333V16.25H4.58333V14.5833H6.25V11.25L1.25 3.75ZM8.83333 7.08333L10 5.41667H4.15833L5.325 7.08333H8.83333ZM14.5833 3.75H18.75V6.25H16.25V13.75C16.25 15.1333 15.1333 16.25 13.75 16.25C12.3667 16.25 11.25 15.1333 11.25 13.75C11.25 12.3667 12.3667 11.25 13.75 11.25C14.0417 11.25 14.325 11.3 14.5833 11.3917V3.75Z"
        fill={color}
      />
    </Svg>
  );
}

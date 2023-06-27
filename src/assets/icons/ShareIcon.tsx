import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ShareIcon({ width = 16, height = 15, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.8333 13.3333H2.16667V1.66667H8V0H2.16667C1.24167 0 0.5 0.75 0.5 1.66667V13.3333C0.5 14.25 1.24167 15 2.16667 15H13.8333C14.75 15 15.5 14.25 15.5 13.3333V7.5H13.8333V13.3333ZM9.66667 0V1.66667H12.6583L4.46667 9.85833L5.64167 11.0333L13.8333 2.84167V5.83333H15.5V0H9.66667Z"
        fill={color}
      />
    </Svg>
  );
}

import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SadadBillPaymentIcon({ color = "#FF7512", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M23.5 11.5L22 10L20.5 11.5L19 10L17.5 11.5L16 10L14.5 11.5L13 10L11.5 11.5L10 10L8.5 11.5L7 10V30L8.5 28.5L10 30L11.5 28.5L13 30L14.5 28.5L16 30L17.5 28.5L19 30L20.5 28.5L22 30L23.5 28.5L25 30V10L23.5 11.5ZM23 27.09H9V12.91H23V27.09ZM10 23H22V25H10V23ZM10 19H22V21H10V19ZM10 15H22V17H10V15Z"
        fill={color}
      />
    </Svg>
  );
}

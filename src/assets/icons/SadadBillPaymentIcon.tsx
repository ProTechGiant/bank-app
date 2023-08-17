import { G, Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SadadBillPaymentIcon({ color = "#FF7512", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="outlined_flag">
        <Path
          id="Vector"
          d="M13.5 5.5L12.5 3.5H4.5V20.5H6.5V13.5H11.5L12.5 15.5H19.5V5.5H13.5ZM17.5 13.5H13.5L12.5 11.5H6.5V5.5H11.5L12.5 7.5H17.5V13.5Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

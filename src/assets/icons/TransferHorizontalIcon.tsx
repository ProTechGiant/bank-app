import { G, Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function TransferHorizontalIcon({ color = "#FF7512", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="swap_horiz">
        <Path
          id="Vector"
          d="M6.99 11L3 15L6.99 19V16H14V14H6.99V11ZM21 9L17.01 5V8H10V10H17.01V13L21 9Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

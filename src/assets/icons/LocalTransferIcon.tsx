import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LocalTransferIcon({ width = 24, height = 24, color = "#080E53" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="call_made">
        <Path id="Vector" d="M9.5 4.5V6.5H16.09L4.5 18.09L5.91 19.5L17.5 7.91V14.5H19.5V4.5H9.5Z" fill={color} />
      </G>
    </Svg>
  );
}

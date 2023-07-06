import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function HelpIcon({ width = 24, height = 24, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.166 5.833h1.667v1.666H9.166V5.833zm0 3.333h1.667v5H9.166v-5zm.833-7.5a8.336 8.336 0 00-8.333 8.333c0 4.6 3.733 8.334 8.333 8.334s8.334-3.734 8.334-8.334-3.734-8.333-8.334-8.333zm0 15a6.676 6.676 0 01-6.666-6.667 6.676 6.676 0 016.666-6.666 6.676 6.676 0 016.667 6.666 6.676 6.676 0 01-6.667 6.667z"
        fill={color}
      />
    </Svg>
  );
}

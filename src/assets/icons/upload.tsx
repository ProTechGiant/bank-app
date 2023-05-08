import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function Upload({ width = 16, height = 16, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM3 5L4.41 6.41L7 3.83V12H9V3.83L11.59 6.41L13 5L8 0L3 5Z"
        fill={color}
      />
    </Svg>
  );
}

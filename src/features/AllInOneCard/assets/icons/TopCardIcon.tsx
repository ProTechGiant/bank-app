import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function TopCardIcon({ width = 350, height = 178, color = "#2C2636" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 350 178" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 16C0 7.16344 7.16344 0 16 0H334C342.837 0 350 7.16344 350 16V160.007C349.834 160.002 349.667 160 349.5 160C339.835 160 332 167.835 332 177.5C332 177.667 332.002 177.834 332.007 178H16.993C16.9977 177.834 17 177.667 17 177.5C17 168.002 9.43376 160.272 0 160.007V16Z"
        fill={color}
      />
    </Svg>
  );
}

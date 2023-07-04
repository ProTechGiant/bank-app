import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function ArrowBackIcon({ width = 54, height = 55 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M35 21H22.83L28.42 15.41L27 14L19 22L27 30L28.41 28.59L22.83 23H35V21Z" fill="black" />
    </Svg>
  );
}

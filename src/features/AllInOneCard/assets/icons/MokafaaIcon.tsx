import Svg, { Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MokafaaIcon({ width = 42, height = 27 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 42 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect x="-5.29297" width="55.3613" height="29.4781" fill="#F7896E" />
    </Svg>
  );
}

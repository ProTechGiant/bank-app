import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ArrowForwardIcon({ width = 18, height = 18, color = "black", isRtl = false }: IconProps) {
  return (
    <Svg
      style={{ transform: [{ rotate: isRtl ? "180deg" : "0deg" }] }}
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M9 3L7.9425 4.0575L12.1275 8.25H3V9.75H12.1275L7.9425 13.9425L9 15L15 9L9 3Z" fill={color} />
    </Svg>
  );
}

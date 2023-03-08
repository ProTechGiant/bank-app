import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronRightIcon({ color = "#FF5B00", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.70492 6.5L8.29492 7.91L12.8749 12.5L8.29492 17.09L9.70492 18.5L15.7049 12.5L9.70492 6.5Z"
        fill={color}
      />
    </Svg>
  );
}

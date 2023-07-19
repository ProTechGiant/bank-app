import { G, Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function AngleDownIcon({ color = "#002233", height = 20, width = 20 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="expand_more">
        <Path
          id="Vector"
          d="M13.825 6.9126L10 10.7293L6.175 6.9126L5 8.0876L10 13.0876L15 8.0876L13.825 6.9126Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

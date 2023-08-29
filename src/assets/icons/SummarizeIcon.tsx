import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SummarizeIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="summarize">
        <Path
          id="Vector"
          d="M15 3H5C3.9 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 4.99 21H19C20.1 21 21 20.1 21 19V9L15 3ZM5 19V5H14V10H19V19H5ZM9 8C9 8.55 8.55 9 8 9C7.45 9 7 8.55 7 8C7 7.45 7.45 7 8 7C8.55 7 9 7.45 9 8ZM9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12ZM9 16C9 16.55 8.55 17 8 17C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15C8.55 15 9 15.45 9 16Z"
          fill={color as string}
        />
      </G>
    </Svg>
  );
}

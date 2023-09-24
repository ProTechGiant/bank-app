import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function HighRiskIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        id="Vector"
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill={color}
      />
      <Path
        id="path"
        d="M6.37181 17.1817C6.17979 16.2055 6.56164 15.8557 7.51737 16.1322C8.47309 16.4088 8.85494 16.059 8.66292 15.0827C8.4709 14.1065 8.85275 13.7567 9.80847 14.0333C10.7642 14.3098 11.1461 13.96 10.954 12.9838C10.762 12.0075 11.1439 11.6577 12.0996 11.9343C13.0553 12.2108 13.4372 11.861 13.2451 10.8848C13.0531 9.90855 13.435 9.55872 14.3907 9.8353C15.3464 10.1119 15.7283 9.76204 15.5362 8.78581C15.3442 7.80958 15.7261 7.45975 16.6818 7.73632C17.6375 8.01289 18.0194 7.66306 17.8274 6.68683"
        stroke={color}
        stroke-linecap="round"
      />
    </Svg>
  );
}

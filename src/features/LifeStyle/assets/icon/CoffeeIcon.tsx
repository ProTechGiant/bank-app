import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CoffeeIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 3H3V13C3 15.21 4.79 17 7 17H13C15.21 17 17 15.21 17 13V10H19C20.11 10 21 9.1 21 8V5C21 3.89 20.11 3 19 3ZM19 8H17V5H19V8ZM3 19H19V21H3V19Z"
        fill={color}
      />
    </Svg>
  );
}

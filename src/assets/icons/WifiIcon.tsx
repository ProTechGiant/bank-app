import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function WifiIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1 9.27711L3 11.2771C7.97 6.30711 16.03 6.30711 21 11.2771L23 9.27711C16.93 3.20711 7.08 3.20711 1 9.27711ZM9 17.2771L12 20.2771L15 17.2771C13.35 15.6171 10.66 15.6171 9 17.2771ZM5 13.2771L7 15.2771C9.76 12.5171 14.24 12.5171 17 15.2771L19 13.2771C15.14 9.41711 8.87 9.41711 5 13.2771Z"
        fill={color}
      />
    </Svg>
  );
}

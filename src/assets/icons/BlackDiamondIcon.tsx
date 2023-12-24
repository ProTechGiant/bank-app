import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function BlackDiamondIcon({ color = "#1E1A25", height = 29, width = 30 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 29 30" fill="none">
      <Path d="M14.6935 4.66797H14.3068L11.1289 11.0117H17.8714L14.6935 4.66797Z" fill={color} />
      <Path d="M19.8893 11.0117H26.1243L22.9585 4.66797H16.7235L19.8893 11.0117Z" fill={color} />
      <Path d="M25.8343 12.8242H15.4064V25.3305L25.8343 12.8242Z" fill={color} />
      <Path d="M13.5939 25.3305V12.8242H3.16598L13.5939 25.3305Z" fill={color} />
      <Path d="M9.11098 11.0117L12.2768 4.66797H6.04181L2.87598 11.0117H9.11098Z" fill={color} />
    </Svg>
  );
}

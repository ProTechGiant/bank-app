import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function SpendingInsightIcon({ width = 32, height = 37, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M25 15.25C23.55 15.25 22.74 16.69 23.07 17.76L19.52 21.32C19.22 21.23 18.78 21.23 18.48 21.32L15.93 18.77C16.27 17.7 15.46 16.25 14 16.25C12.55 16.25 11.73 17.69 12.07 18.77L7.51 23.32C6.44 22.99 5 23.8 5 25.25C5 26.35 5.9 27.25 7 27.25C8.45 27.25 9.26 25.81 8.93 24.74L13.48 20.18C13.78 20.27 14.22 20.27 14.52 20.18L17.07 22.73C16.73 23.8 17.54 25.25 19 25.25C20.45 25.25 21.27 23.81 20.93 22.73L24.49 19.18C25.56 19.51 27 18.7 27 17.25C27 16.15 26.1 15.25 25 15.25Z"
        fill={color}
      />
      <Path
        d="M19 16.25L19.94 14.18L22 13.25L19.94 12.32L19 10.25L18.08 12.32L16 13.25L18.08 14.18L19 16.25Z"
        fill={color}
      />
      <Path d="M7.5 18.25L8 16.25L10 15.75L8 15.25L7.5 13.25L7 15.25L5 15.75L7 16.25L7.5 18.25Z" fill={color} />
    </Svg>
  );
}

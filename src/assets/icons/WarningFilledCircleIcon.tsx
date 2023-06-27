import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function WarningFilledCircleIcon({ width = 78, height = 81 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 78 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_6791_54461)">
        <Path
          d="M70.5462 21.3832L70.5524 21.3894L67.0845 16.4897L65.5637 16.042C59.134 10.3941 50.7051 6.96924 41.476 6.96924C21.3037 6.96924 4.9519 23.3211 4.9519 43.4933C4.9519 48.7732 6.07412 53.7864 8.08858 58.3182L6.18757 56.871L11.397 64.2175C17.9861 73.7594 28.9967 80.0143 41.4729 80.0143C61.6452 80.0143 77.997 63.6625 77.997 43.4902C77.997 35.181 75.2191 27.5186 70.5462 21.3832Z"
          fill="#FEB24F"
        />
        <Path
          d="M36.5241 73.0482C56.6958 73.0482 73.0482 56.6958 73.0482 36.5241C73.0482 16.3524 56.6958 0 36.5241 0C16.3524 0 0 16.3524 0 36.5241C0 56.6958 16.3524 73.0482 36.5241 73.0482Z"
          fill="#FFF0DC"
        />
        <Path d="M39.7252 17.1582H32.9705V41.0282H39.7252V17.1582Z" fill="#FEB24F" />
        <Path d="M39.7497 47.0347H32.9705V53.7894H39.7497V47.0347Z" fill="#FEB24F" />
      </G>
      <Defs>
        <ClipPath id="clip0_6791_54461">
          <Rect width="78" height="80.0145" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

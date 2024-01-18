import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function OrderCardIcon({ color = "#FF523D", height = 20, width = 20 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={height} height={width} viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.5 5.06283V14.9378C18.5 15.4656 18.3161 15.9137 17.9483 16.282C17.58 16.6498 17.1319 16.8337 16.6042 16.8337H3.39583C2.86806 16.8337 2.42 16.6498 2.05167 16.282C1.68389 15.9137 1.5 15.4656 1.5 14.9378V5.06283C1.5 4.53505 1.68389 4.08699 2.05167 3.71866C2.42 3.35088 2.86806 3.16699 3.39583 3.16699H16.6042C17.1319 3.16699 17.58 3.35088 17.9483 3.71866C18.3161 4.08699 18.5 4.53505 18.5 5.06283ZM3.39583 6.64616H16.6042V5.06283H3.39583V6.64616ZM3.39583 9.97949V14.9378H16.6042V9.97949H3.39583Z"
        fill={color}
      />
    </Svg>
  );
}

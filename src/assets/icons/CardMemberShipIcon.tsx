import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function CardMemberShipIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="card_membership">
        <Path
          id="Vector"
          d="M20 2H4C2.89 2 2 2.89 2 4V15C2 16.11 2.89 17 4 17H8V22L12 20L16 22V17H20C21.11 17 22 16.11 22 15V4C22 2.89 21.11 2 20 2ZM20 15H4V13H20V15ZM20 10H4V4H20V10Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

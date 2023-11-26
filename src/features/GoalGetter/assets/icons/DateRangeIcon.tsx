import Svg, { G, Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function DateRangeIcon({ width = 24, height = 24, color = "#FF523D" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G id="date_range">
        <Path
          id="Vector"
          d="M7 11H9V13H7V11ZM21 6V20C21 21.1 20.1 22 19 22H5C3.89 22 3 21.1 3 20L3.01 6C3.01 4.9 3.89 4 5 4H6V2H8V4H16V2H18V4H19C20.1 4 21 4.9 21 6ZM5 8H19V6H5V8ZM19 20V10H5V20H19ZM15 13H17V11H15V13ZM11 13H13V11H11V13Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

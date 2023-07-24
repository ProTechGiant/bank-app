import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CheckBoxIcon({ width = 24, height = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
        fill={color}
      />
    </Svg>
  );
}

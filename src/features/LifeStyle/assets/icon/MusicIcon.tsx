import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MusicIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3 12V19C3 20.1 3.9 21 5 21H7C8.1 21 9 20.1 9 19V15C9 13.9 8.1 13 7 13H5V12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12V13H17C15.9 13 15 13.9 15 15V19C15 20.1 15.9 21 17 21H19C20.1 21 21 20.1 21 19V12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12Z"
        fill={color}
      />
    </Svg>
  );
}

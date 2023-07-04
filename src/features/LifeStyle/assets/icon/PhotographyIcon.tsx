import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function PhotographyIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 16.2C13.7673 16.2 15.2 14.7673 15.2 13C15.2 11.2327 13.7673 9.8 12 9.8C10.2327 9.8 8.8 11.2327 8.8 13C8.8 14.7673 10.2327 16.2 12 16.2Z"
        fill={color}
      />
      <Path
        d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z"
        fill={color}
      />
    </Svg>
  );
}

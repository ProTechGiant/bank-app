import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function PersonFilledIcon({ width = 18, height = 19, color = "#000000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9 9.5C10.6575 9.5 12 8.1575 12 6.5C12 4.8425 10.6575 3.5 9 3.5C7.3425 3.5 6 4.8425 6 6.5C6 8.1575 7.3425 9.5 9 9.5ZM9 11C6.9975 11 3 12.005 3 14V15.5H15V14C15 12.005 11.0025 11 9 11Z"
        fill={color}
      />
    </Svg>
  );
}

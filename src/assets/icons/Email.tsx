import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function Email({ width = 24, height = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 10.99L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
        fill={color}
      />
    </Svg>
  );
}

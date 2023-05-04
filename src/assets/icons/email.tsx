import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function Email({ width = 46, height = 44, color = "#000000" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 46 44">
      <Path
        fill={color}
        d="M31.334 15.334H14.667v13.333h16.667V15.333zm-1.667 3.333L23 22.833l-6.666-4.166V17L23 21.167 29.667 17v1.667z"
      />
    </Svg>
  );
}

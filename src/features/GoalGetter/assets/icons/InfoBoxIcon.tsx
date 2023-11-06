import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const InfoBoxIcon = ({ width = 16, height = 16, color = "#423D4A" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 2.668a5.332 5.332 0 00-5.333 5.333A5.332 5.332 0 0010 13.335 5.332 5.332 0 0015.333 8 5.332 5.332 0 0010 2.668zm0 9.333c-2.207 0-4-1.793-4-4 0-2.206 1.793-4 4-4s4 1.794 4 4c0 2.207-1.793 4-4 4zm-8-4c0-1.74 1.113-3.22 2.667-3.766V2.84a5.33 5.33 0 00-4 5.16 5.33 5.33 0 004 5.16v-1.393A3.994 3.994 0 012 8.001z"
        fill={color}
      />
    </Svg>
  );
};

export default InfoBoxIcon;

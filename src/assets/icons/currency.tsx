import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

import type { IconProps } from "./index";

export default function CurrencyIcon({ width = 20, height = 21, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clipPath="url(#clip0_4939_56887)" fill={color}>
        <Path d="M10.656 18.418L2.498 10.26v1.666c0 .442.175.867.492 1.175l6.491 6.492c.65.65 1.709.65 2.359 0l5.175-5.175a1.67 1.67 0 000-2.358l-6.359 6.358z" />
        <Path d="M9.481 15.426c.325.325.75.492 1.175.492.425 0 .85-.167 1.175-.492l5.175-5.175a1.67 1.67 0 000-2.358l-6.491-6.492A1.665 1.665 0 009.34.918H4.165c-.917 0-1.667.75-1.667 1.667V7.76c0 .441.175.866.492 1.175l6.491 6.491zM4.165 2.585H9.34l6.491 6.491-5.175 5.175L4.165 7.76V2.585z" />
        <Path d="M6.04 5.501a1.042 1.042 0 100-2.083 1.042 1.042 0 000 2.083z" />
      </G>
      <Defs>
        <ClipPath id="clip0_4939_56887">
          <Path fill={color} transform="translate(0 .5)" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

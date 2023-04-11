import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function Info({ width = 33, height = 32, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16.5007 2.66797L5.83398 6.66797V14.788C5.83398 21.5213 10.3807 27.8013 16.5007 29.3346C22.6206 27.8013 27.1673 21.5213 27.1673 14.788V6.66797L16.5007 2.66797ZM24.5007 14.788C24.5007 20.1213 21.1006 25.0546 16.5007 26.5613C11.9007 25.0546 8.50065 20.1346 8.50065 14.788V8.5213L16.5007 5.5213L24.5007 8.5213V14.788Z"
        fill={color}
      />
      <Path d="M17.834 18.668H15.1673V21.3346H17.834V18.668Z" fill={color} />
      <Path d="M17.834 9.33464H15.1673V16.0013H17.834V9.33464Z" fill={color} />
    </Svg>
  );
}

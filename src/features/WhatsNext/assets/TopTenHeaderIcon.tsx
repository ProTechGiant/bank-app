import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons/index";

export default function TopTenHeaderIcon({ width = 312, height = 52, color = "#39FDDC" }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d={`M-2.16699 26.1175L95.6013 51.0391C106.491 53.816 118.027 50.4736 125.758 42.3145L151.465 15.1613C159.054 7.1436 170.328 3.77089 181.077 6.30545L${width} 37.1343V-247H-2.16699V26.1276V26.1175Z`}
        fill={color}
      />
    </Svg>
  );
}

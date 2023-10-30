import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CalendarIcon({ width = 18, height = 19, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.6665 2.0026H14.8332V0.335938H13.1665V2.0026H4.83317V0.335938H3.1665V2.0026H2.33317C1.4165 2.0026 0.666504 2.7526 0.666504 3.66927V17.0026C0.666504 17.9193 1.4165 18.6693 2.33317 18.6693H15.6665C16.5832 18.6693 17.3332 17.9193 17.3332 17.0026V3.66927C17.3332 2.7526 16.5832 2.0026 15.6665 2.0026ZM15.6665 17.0026H2.33317V7.83594H15.6665V17.0026ZM15.6665 6.16927H2.33317V3.66927H15.6665V6.16927Z"
        fill={color}
      />
    </Svg>
  );
}

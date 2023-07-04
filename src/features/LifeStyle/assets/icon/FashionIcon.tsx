import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function FashionIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M12.1609 3.4502H11.8409L9.21086 8.7002H14.7909L12.1609 3.4502Z" fill={color} />
      <Path
        d="M16.4609 8.7002H21.6209L19.5509 4.5602C19.2109 3.8802 18.5209 3.4502 17.7609 3.4502H13.8309L16.4609 8.7002Z"
        fill={color}
      />
      <Path d="M21.3809 10.2002H12.7509V20.5502L21.3809 10.2002Z" fill={color} />
      <Path d="M11.2509 20.5502V10.2002H2.62086L11.2509 20.5502Z" fill={color} />
      <Path
        d="M7.54086 8.7002L10.1609 3.4502H6.24086C5.48086 3.4502 4.79086 3.8802 4.45086 4.5602L2.38086 8.7002H7.54086Z"
        fill={color}
      />
    </Svg>
  );
}

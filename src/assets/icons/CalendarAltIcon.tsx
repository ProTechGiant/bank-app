import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function CalendarAltIcon({ width = 18, height = 19, color = "#000000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.6667 2.00016H14.8334V0.333496H13.1667V2.00016H4.83342V0.333496H3.16675V2.00016H2.33341C1.41675 2.00016 0.666748 2.75016 0.666748 3.66683V17.0002C0.666748 17.9168 1.41675 18.6668 2.33341 18.6668H15.6667C16.5834 18.6668 17.3334 17.9168 17.3334 17.0002V3.66683C17.3334 2.75016 16.5834 2.00016 15.6667 2.00016ZM15.6667 17.0002H2.33341V6.16683H15.6667V17.0002Z"
        fill={color}
      />
    </Svg>
  );
}

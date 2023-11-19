import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function CheckCircleFilledIcon({ color = "#1D9158", height = 22, width = 22 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22 22" fill="none">
      <Path
        d="M10.9987 1.83594C5.9387 1.83594 1.83203 5.94261 1.83203 11.0026C1.83203 16.0626 5.9387 20.1693 10.9987 20.1693C16.0587 20.1693 20.1654 16.0626 20.1654 11.0026C20.1654 5.94261 16.0587 1.83594 10.9987 1.83594ZM9.16537 15.5859L4.58203 11.0026L5.87453 9.71011L9.16537 12.9918L16.1229 6.03427L17.4154 7.33594L9.16537 15.5859Z"
        fill={color}
      />
    </Svg>
  );
}

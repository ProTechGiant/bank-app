import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ShowCardIcon({ width = 24, height = 24, color = "#1E1A25" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.0748 20.1998C3.44147 20.1998 2.9038 19.9791 2.4618 19.5378C2.02047 19.0958 1.7998 18.5581 1.7998 17.9248V6.0748C1.7998 5.44147 2.02047 4.9038 2.4618 4.4618C2.9038 4.02047 3.44147 3.7998 4.0748 3.7998H19.9248C20.5581 3.7998 21.0958 4.02047 21.5378 4.4618C21.9791 4.9038 22.1998 5.44147 22.1998 6.0748V17.9248C22.1998 18.5581 21.9791 19.0958 21.5378 19.5378C21.0958 19.9791 20.5581 20.1998 19.9248 20.1998H4.0748ZM4.0748 7.9748V11.9748H19.9248V7.9748H4.0748Z"
        fill={color}
      />
    </Svg>
  );
}

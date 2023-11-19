import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MoreHorizontalIcon({ width = 25, height = 25, color = "#FFF" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 25 25" fill="none">
      <Path
        d="M7.5 11C6.675 11 6 11.675 6 12.5C6 13.325 6.675 14 7.5 14C8.325 14 9 13.325 9 12.5C9 11.675 8.325 11 7.5 11ZM16.5 11C15.675 11 15 11.675 15 12.5C15 13.325 15.675 14 16.5 14C17.325 14 18 13.325 18 12.5C18 11.675 17.325 11 16.5 11ZM12 11C11.175 11 10.5 11.675 10.5 12.5C10.5 13.325 11.175 14 12 14C12.825 14 13.5 13.325 13.5 12.5C13.5 11.675 12.825 11 12 11Z"
        fill={color}
      />
    </Svg>
  );
}

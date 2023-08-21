import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function TickCircleOutlineIcon({ color = "#FAFAFA", height = 14, width = 15 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 1.5C3.24 1.5 1 3.74 1 6.5C1 9.26 3.24 11.5 6 11.5C8.76 11.5 11 9.26 11 6.5C11 3.74 8.76 1.5 6 1.5ZM6 10.5C3.795 10.5 2 8.705 2 6.5C2 4.295 3.795 2.5 6 2.5C8.205 2.5 10 4.295 10 6.5C10 8.705 8.205 10.5 6 10.5ZM8.295 4.29L5 7.585L3.705 6.295L3 7L5 9L9 5L8.295 4.29Z"
        fill={color}
      />
    </Svg>
  );
}

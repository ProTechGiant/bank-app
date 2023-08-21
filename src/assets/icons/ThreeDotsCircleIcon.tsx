import { Path, Svg } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function ThreeDotsCircleIcon({ color = "#FAFAFA", height = 12, width = 13 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 1.5C3.24 1.5 1 3.74 1 6.5C1 9.26 3.24 11.5 6 11.5C8.76 11.5 11 9.26 11 6.5C11 3.74 8.76 1.5 6 1.5ZM6 10.5C3.79 10.5 2 8.71 2 6.5C2 4.29 3.79 2.5 6 2.5C8.21 2.5 10 4.29 10 6.5C10 8.71 8.21 10.5 6 10.5Z"
        fill={color}
      />
      <Path
        d="M3.5 7.25C3.91421 7.25 4.25 6.91421 4.25 6.5C4.25 6.08579 3.91421 5.75 3.5 5.75C3.08579 5.75 2.75 6.08579 2.75 6.5C2.75 6.91421 3.08579 7.25 3.5 7.25Z"
        fill={color}
      />
      <Path
        d="M6 7.25C6.41421 7.25 6.75 6.91421 6.75 6.5C6.75 6.08579 6.41421 5.75 6 5.75C5.58579 5.75 5.25 6.08579 5.25 6.5C5.25 6.91421 5.58579 7.25 6 7.25Z"
        fill={color}
      />
      <Path
        d="M8.5 7.25C8.91421 7.25 9.25 6.91421 9.25 6.5C9.25 6.08579 8.91421 5.75 8.5 5.75C8.08579 5.75 7.75 6.08579 7.75 6.5C7.75 6.91421 8.08579 7.25 8.5 7.25Z"
        fill={color}
      />
    </Svg>
  );
}

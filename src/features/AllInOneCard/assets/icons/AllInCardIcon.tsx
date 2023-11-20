import { Path, Rect, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function AllInCardIcon({ width = 34, height = 34 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx={17} fill="#FAFAFA" fillOpacity={0.3} />
      <Path
        d="M23.75 11H10.25C9.42157 11 8.75 11.6716 8.75 12.5V21.5C8.75 22.3284 9.42157 23 10.25 23H23.75C24.5784 23 25.25 22.3284 25.25 21.5V12.5C25.25 11.6716 24.5784 11 23.75 11Z"
        stroke="#FAFAFA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8.75 15.5H25.25" stroke="#FAFAFA" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

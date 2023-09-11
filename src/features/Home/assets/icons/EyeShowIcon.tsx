import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function EyeShowIcon({ width = 34, height = 34, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={36} height={36} rx={18} fill="#F2F2F2" />
      <Path
        d="M18 12.5a9.77 9.77 0 018.82 5.5A9.77 9.77 0 0118 23.5 9.77 9.77 0 019.18 18 9.77 9.77 0 0118 12.5zm0-2c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5a2.5 2.5 0 010 5 2.5 2.5 0 010-5zm0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z"
        fill={color}
      />
    </Svg>
  );
}

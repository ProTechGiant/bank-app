import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function RefreshBalanceIcon({ width = 34, height = 34, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={36} height={36} rx={18} fill="#F2F2F2" />
      <Path
        d="M18 12V8l-5 5 5 5v-4c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
        fill={color}
      />
    </Svg>
  );
}

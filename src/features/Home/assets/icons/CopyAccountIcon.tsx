import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CopyAccountIcon({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect y={0.799805} width={36} height={36} rx={18} fill="#FAFAFA" fillOpacity={0.6} />
      <Path
        d="M22.5 7.8h-12c-1.1 0-2 .9-2 2v14h2v-14h12v-2zm3 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2zm0 16h-11v-14h11v14z"
        fill={color}
      />
    </Svg>
  );
}

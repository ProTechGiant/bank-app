import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function CopyIcon({ width = 20, height = 22, color = "#ffffff" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14.5 0h-12C1.4 0 .5.9.5 2v14h2V2h12V0zm3 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16h-11V6h11v14z"
        fill={color}
      />
    </Svg>
  );
}

import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function MutualFundIcon({ color = "#2E2E2E", height = 20, width = 20 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.3346 5.44531L15.243 7.35365L11.1763 11.4203L7.84297 8.08698L1.66797 14.2703L2.84297 15.4453L7.84297 10.4453L11.1763 13.7786L16.4263 8.53698L18.3346 10.4453V5.44531H13.3346Z"
        fill={color}
      />
    </Svg>
  );
}

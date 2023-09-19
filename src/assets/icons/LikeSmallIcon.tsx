import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LikeSmallIcon({ width = 24, height = 24, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M12 21.175L10.55 19.855C5.4 15.185 2 12.105 2 8.32495C2 5.24495 4.42 2.82495 7.5 2.82495C9.24 2.82495 10.91 3.63495 12 4.91495C13.09 3.63495 14.76 2.82495 16.5 2.82495C19.58 2.82495 22 5.24495 22 8.32495C22 12.105 18.6 15.185 13.45 19.865L12 21.175Z"
        stroke="#2E2E2E"
        strokeWidth={color === "#FF371E" ? 0 : 2}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function DownloadIcon({ width = 24, height = 24, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 9.5H15V3.5H9V9.5H5L12 16.5L19 9.5ZM11 11.5V5.5H13V11.5H14.17L12 13.67L9.83 11.5H11ZM5 18.5H19V20.5H5V18.5Z"
        fill={color}
      />
    </Svg>
  );
}

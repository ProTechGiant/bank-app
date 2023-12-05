import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MonthCalenderIcon({ width = 20, height = 20, color = "#9291A1" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.833 3.333H15V1.667h-1.667v1.666H6.667V1.667H5v1.666h-.833A1.66 1.66 0 002.508 5L2.5 16.667c0 .916.742 1.666 1.667 1.666h11.666c.917 0 1.667-.75 1.667-1.666V5c0-.917-.75-1.667-1.667-1.667zm0 13.334H4.167V8.333h11.666v8.334zm0-10H4.167V5h11.666v1.667zm-8.333 5H5.833V10H7.5v1.667zm3.333 0H9.167V10h1.666v1.667zm3.334 0H12.5V10h1.667v1.667zM7.5 15H5.833v-1.667H7.5V15zm3.333 0H9.167v-1.667h1.666V15zm3.334 0H12.5v-1.667h1.667V15z"
        fill={color}
      />
    </Svg>
  );
}

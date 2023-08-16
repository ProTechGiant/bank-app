import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export const TrendingUpIcon = ({ width = 16, height = 16, color = "#FF371E" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10.6663 4L12.193 5.52667L8.93967 8.78L6.27301 6.11333L1.33301 11.06L2.27301 12L6.27301 8L8.93967 10.6667L13.1397 6.47333L14.6663 8V4H10.6663Z"
        fill={color}
      />
    </Svg>
  );
};

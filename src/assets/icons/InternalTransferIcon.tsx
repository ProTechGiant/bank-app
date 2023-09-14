import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function InternalTransferIcon({ width = 20, height = 20, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18.403 14.9997V13.333H6.73633V3.33301H8.403L5.903 0.833008L3.40299 3.33301H5.06966V4.99967H1.73633V6.66634H5.06966V13.333C5.06966 14.2497 5.81966 14.9997 6.73633 14.9997H13.403V16.6663H11.7363L14.2363 19.1663L16.7363 16.6663H15.0697V14.9997H18.403ZM8.403 6.66634H13.403V11.6663H15.0697V6.66634C15.0697 5.74967 14.3197 4.99967 13.403 4.99967H8.403V6.66634Z"
        fill={color}
      />
    </Svg>
  );
}

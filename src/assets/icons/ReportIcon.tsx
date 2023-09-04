import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ReportIcon({ width = 30, height = 26 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 6.49L19.53 19.5H4.47L12 6.49ZM12 2.5L1 21.5H23L12 2.5ZM13 16.5H11V18.5H13V16.5ZM13 10.5H11V14.5H13V10.5Z"
        fill="#FF371E"
      />
    </Svg>
  );
}

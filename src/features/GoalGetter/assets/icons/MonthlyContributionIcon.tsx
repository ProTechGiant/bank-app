import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MonthlyContributionIcon({ width = 22, height = 22, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18.5 10V4C18.5 2.9 17.6 2 16.5 2H15.5V0H13.5V2H5.5V0H3.5V2H2.5C1.4 2 0.5 2.9 0.5 4V18C0.5 19.1 1.4 20 2.5 20H9.5V18H2.5V8H16.5V10H18.5ZM16.5 6H2.5V4H16.5V6ZM13.14 18C13.57 19.45 14.91 20.5 16.5 20.5C18.43 20.5 20 18.93 20 17C20 15.07 18.43 13.5 16.5 13.5C15.55 13.5 14.68 13.88 14.05 14.5H15.5V16H11.5V12H13V13.43C13.9 12.55 15.14 12 16.5 12C19.26 12 21.5 14.24 21.5 17C21.5 19.76 19.26 22 16.5 22C14.08 22 12.06 20.28 11.6 18H13.14Z"
        fill={color}
      />
    </Svg>
  );
}

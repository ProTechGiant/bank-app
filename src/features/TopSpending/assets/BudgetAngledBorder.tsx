import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BudgetAngledBorder({ width = 131, height = 152, color = "#39FDDC" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 131 152" fill={color}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 -0.5H144V162.5H0V152H7.96419L25.3445 92.1708C27.0923 86.159 25.2553 79.4606 20.9035 75.9726L11.2548 68.2369C6.71573 64.5992 4.94115 57.499 7.03082 51.3557L24.5092 0H0V-0.5Z"
        fill={color}
      />
    </Svg>
  );
}

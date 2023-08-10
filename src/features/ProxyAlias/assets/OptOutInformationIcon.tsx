import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function OptOutInformationIcon({ width = 16, height = 16, color }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6.3335 4.16668H7.66683V5.50001H6.3335V4.16668ZM6.3335 6.83334H7.66683V10.8333H6.3335V6.83334ZM7.00016 0.833344C3.32016 0.833344 0.333496 3.82001 0.333496 7.50001C0.333496 11.18 3.32016 14.1667 7.00016 14.1667C10.6802 14.1667 13.6668 11.18 13.6668 7.50001C13.6668 3.82001 10.6802 0.833344 7.00016 0.833344ZM7.00016 12.8333C4.06016 12.8333 1.66683 10.44 1.66683 7.50001C1.66683 4.56001 4.06016 2.16668 7.00016 2.16668C9.94016 2.16668 12.3335 4.56001 12.3335 7.50001C12.3335 10.44 9.94016 12.8333 7.00016 12.8333Z"
        fill={color}
      />
    </Svg>
  );
}

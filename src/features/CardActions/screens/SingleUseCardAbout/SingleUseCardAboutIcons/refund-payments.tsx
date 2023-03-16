import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const RefundPaymentsIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M19 14V6C19 4.9 18.1 4 17 4H3C1.9 4 1 4.9 1 6V14C1 15.1 1.9 16 3 16H17C18.1 16 19 15.1 19 14ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13ZM23 7V18C23 19.1 22.1 20 21 20H4V18H21V7H23Z"
      fill={color}
    />
  </Svg>
);

export { RefundPaymentsIcon };

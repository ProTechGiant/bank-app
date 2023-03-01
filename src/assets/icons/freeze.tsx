import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const FreezeIcon = ({ width = 20, height = 20, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M20 9H15.83L19.07 5.76L17.66 4.34L13 9H11V7L15.66 2.34L14.24 0.93L11 4.17V0H9V4.17L5.76 0.93L4.34 2.34L9 7V9H7L2.34 4.34L0.93 5.76L4.17 9H0V11H4.17L0.93 14.24L2.34 15.66L7 11H9V13L4.34 17.66L5.76 19.07L9 15.83V20H11V15.83L14.24 19.07L15.66 17.66L11 13V11H13L17.66 15.66L19.07 14.24L15.83 11H20V9Z"
      fill={color}
    />
  </Svg>
);

export { FreezeIcon };

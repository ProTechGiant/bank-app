import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const StarIcon = ({ width = 24, height = 24, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z"
      fill={color}
    />
  </Svg>
);

export { StarIcon };

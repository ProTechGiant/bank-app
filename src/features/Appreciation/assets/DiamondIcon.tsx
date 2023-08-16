import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export const DiamondIcon = ({ width = 10, height = 9, color = "#FAFAFA" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.5 0H1.5L0 3L5 9L10 3L8.5 0ZM3.81 2.5L4.56 1H5.44L6.19 2.5H3.81ZM4.5 3.5V6.84L1.72 3.5H4.5ZM5.5 3.5H8.28L5.5 6.84V3.5ZM8.63 2.5H7.305L6.555 1H7.88L8.63 2.5ZM2.12 1H3.445L2.695 2.5H1.37L2.12 1Z"
        fill={color}
      />
    </Svg>
  );
};

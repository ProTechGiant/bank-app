import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const DeleteIcon = ({ width = 24, height = 25, color = "#C50707" }: IconProps) => (
  <Svg width={width} height={height}  viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M16 9.5V19.5H8V9.5H16ZM14.5 3.5H9.5L8.5 4.5H5V6.5H19V4.5H15.5L14.5 3.5ZM18 7.5H6V19.5C6 20.6 6.9 21.5 8 21.5H16C17.1 21.5 18 20.6 18 19.5V7.5Z"
      fill={color}
    />
  </Svg>
);

export { DeleteIcon };

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const InfoCircleIcon = ({ width = 20, height = 20, color = "#080E53" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M9.16699 5.83332H10.8337V7.49999H9.16699V5.83332ZM9.16699 9.16666H10.8337V14.1667H9.16699V9.16666ZM10.0003 1.66666C5.40033 1.66666 1.66699 5.39999 1.66699 9.99999C1.66699 14.6 5.40033 18.3333 10.0003 18.3333C14.6003 18.3333 18.3337 14.6 18.3337 9.99999C18.3337 5.39999 14.6003 1.66666 10.0003 1.66666ZM10.0003 16.6667C6.32533 16.6667 3.33366 13.675 3.33366 9.99999C3.33366 6.32499 6.32533 3.33332 10.0003 3.33332C13.6753 3.33332 16.667 6.32499 16.667 9.99999C16.667 13.675 13.6753 16.6667 10.0003 16.6667Z"
      fill={color}
    />
  </Svg>
);

export { InfoCircleIcon };

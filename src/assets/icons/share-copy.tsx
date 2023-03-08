import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const ShareCopyIcon = ({ width = 22, height = 22, color = "#FF7512" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M14.5 0.5H0.5V16.5H2.5V2.5H14.5V0.5ZM19.5 4.5H4.5V22.5H19.5V4.5ZM17.5 20.5H6.5V6.5H17.5V20.5Z"
      fill={color}
    />
  </Svg>
);

export { ShareCopyIcon };

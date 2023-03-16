import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const CheckIconBig = ({ width = 36, height = 28, color = "white" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 36 28" fill={color} xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M11.5994 21.8001L3.19941 13.4001L0.399414 16.2001L11.5994 27.4001L35.5994 3.4001L32.7994 0.600098L11.5994 21.8001Z"
      fill={color}
    />
  </Svg>
);

export { CheckIconBig };

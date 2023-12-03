import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BrandShapeVerticalIcon({ width = 25, height = 109, color = "#BBF2D7" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 25 109" fill="none">
      <Path d="M24.3998 140.164L9.20149 -36.8359L0.39978 -36.8359L0.399773 140.164L24.3998 140.164Z" fill={color} />
    </Svg>
  );
}

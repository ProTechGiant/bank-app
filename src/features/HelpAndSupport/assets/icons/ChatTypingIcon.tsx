import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ChatTypingIcon({ width = 10, height = 10, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6.45 1.156l.323-.188v5.065l-.323-.19-1.339-.78V7L.773 4.47 1.1 4.28l1.338-.78 2.675 1.56V1.938L2.436 3.5l-1.337-.778-.326-.19L5.112 0v1.936l1.338-.78z"
        fill={color}
      />
    </Svg>
  );
}

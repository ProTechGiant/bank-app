import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function ChatSendIcon({ width = 24, height = 24, color = "#B3B3B3" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M1.51 21l20.99-9L1.51 3l-.01 7 15 2-15 2 .01 7z" fill={color} />
    </Svg>
  );
}

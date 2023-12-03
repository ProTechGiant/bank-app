import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function LowRiskIcon({ width = 24, height = 24, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M21.2949 4.615L4.11488 21.795C3.72552 22.1844 3.09424 22.1844 2.70488 21.795C2.31552 21.4056 2.31552 20.7744 2.70488 20.385L19.8849 3.205C20.2742 2.81564 20.9055 2.81564 21.2949 3.205C21.6842 3.59436 21.6842 4.22564 21.2949 4.615Z"
        fill={color}
      />
    </Svg>
  );
}

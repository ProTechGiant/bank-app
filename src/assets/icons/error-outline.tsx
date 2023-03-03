import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const ErrorOutlineIcon = ({ width = 20, height = 20, color = "white" }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M9 13h2v2H9v-2zm0-8h2v6H9V5zm.99-5C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
      fill={color}
    />
  </Svg>
);

export { ErrorOutlineIcon };

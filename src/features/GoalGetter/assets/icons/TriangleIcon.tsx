import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const TriangleIcon = ({ width = 20, height = 7, color = "#7DF9DD" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 7l10.256-7L20 7H0z" fill={color} />
    </Svg>
  );
};

export default TriangleIcon;

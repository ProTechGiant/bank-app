import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const BackGoalDetailIcon = ({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx={18} fill="#FAFAFA" fillOpacity={0.6} />
      <Path d="M26 17H13.83L19.42 11.41L18 10L10 18L18 26L19.41 24.59L13.83 19H26V17Z" fill={color} />
    </Svg>
  );
};

export default BackGoalDetailIcon;

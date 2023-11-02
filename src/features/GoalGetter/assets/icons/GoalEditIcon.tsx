import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const GoalEditIcon = ({ width = 36, height = 36, color = "#FAFAFA" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M20.06 15.02l.92.92L11.92 25H11v-.92l9.06-9.06zM23.66 9c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L9 23.25V27h3.75l11.06-11.06-3.75-3.75z"
        fill={color}
      />
    </Svg>
  );
};

export default GoalEditIcon;

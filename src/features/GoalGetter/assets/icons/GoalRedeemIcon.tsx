import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const GoalRedeemIcon = ({ width = 16, height = 16, color = "#002233" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.7507 12.1667L15.9173 8L11.7507 3.83333L10.5757 5.00833L12.7257 7.16667H5.08398V8.83333H12.7257L10.5757 10.9917L11.7507 12.1667Z"
        fill={color}
      />
      <Path
        d="M13.4173 13.8333H1.75065V2.16667H13.4173V3.83333H15.084V2.16667C15.084 1.25 14.3423 0.5 13.4173 0.5H1.75065C0.833984 0.5 0.0839844 1.25 0.0839844 2.16667V13.8333C0.0839844 14.75 0.833984 15.5 1.75065 15.5H13.4173C14.3423 15.5 15.084 14.75 15.084 13.8333V12.1667H13.4173V13.8333Z"
        fill={color}
      />
    </Svg>
  );
};

export default GoalRedeemIcon;

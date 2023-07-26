import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export const AccountIcon = ({ width = 18, height = 18, color = "#004466" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15 3H3C2.1675 3 1.5075 3.6675 1.5075 4.5L1.5 13.5C1.5 14.3325 2.1675 15 3 15H15C15.8325 15 16.5 14.3325 16.5 13.5V4.5C16.5 3.6675 15.8325 3 15 3ZM15 13.5H3V9H15V13.5ZM15 6H3V4.5H15V6Z"
        fill={color}
      />
    </Svg>
  );
};

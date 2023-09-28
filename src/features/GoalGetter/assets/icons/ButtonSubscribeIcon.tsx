import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const ButtonSubscribeIcon = ({ width = 21, height = 20, color = "#FAFAFA" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16.3327 10.8334H11.3327V15.8334H9.66602V10.8334H4.66602V9.16675H9.66602V4.16675H11.3327V9.16675H16.3327V10.8334Z"
        fill={color}
      />
    </Svg>
  );
};

export default ButtonSubscribeIcon;

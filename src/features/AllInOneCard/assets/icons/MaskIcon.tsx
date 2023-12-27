import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MaskIcon({ width = 16, height = 138, color = "#fff" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 138" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.30685 0H0V138H5.77293L15.6712 80.4911C16.4849 75.7696 15.4021 70.8177 12.8278 67.4838L4.10973 56.1922C1.49009 52.7962 0.416932 47.729 1.30852 42.9454L9.3101 0H9.30685Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export function PenIcon({ width = 24, height = 24, color = "#8E8E93" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.715 7.517l.766.766-7.55 7.55h-.766v-.766l7.55-7.55zm3-5.017a.834.834 0 00-.584.242l-1.525 1.525 3.125 3.125 1.525-1.525a.83.83 0 000-1.175l-1.95-1.95a.818.818 0 00-.591-.242zm-3 2.658l-9.217 9.217V17.5h3.125l9.217-9.217-3.125-3.125z"
        fill={color}
      />
    </Svg>
  );
}

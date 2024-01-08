import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function ChatIcon({ width = 16, height = 16, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.334 1.33301H2.66732C1.93398 1.33301 1.33398 1.93301 1.33398 2.66634V14.6663L4.00065 11.9997H13.334C14.0673 11.9997 14.6673 11.3997 14.6673 10.6663V2.66634C14.6673 1.93301 14.0673 1.33301 13.334 1.33301ZM13.334 10.6663H4.00065L2.66732 11.9997V2.66634H13.334V10.6663Z"
        fill={color}
      />
    </Svg>
  );
}

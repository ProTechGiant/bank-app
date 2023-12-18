import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BackgroundCard({ width = 338, height = 212, color = "#1E1A25" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 338 212" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M344 201.886C344 208.575 338.474 214 331.666 214H8.3339C1.52629 214 -4 208.575 -4 201.886V8.11431C-4 1.4246 1.51651 -4 8.3339 -4H331.666C338.483 -4 344 1.4246 344 8.10472V201.876V201.886Z"
        fill={color}
      />
    </Svg>
  );
}

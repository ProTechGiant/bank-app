import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function SubscriptionDetailsIcon({ width = 24, height = 25, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8L16 3ZM19 19H5V5H15V9H19V19ZM7 17H17V15H7V17ZM12 7H7V9H12V7ZM7 13H17V11H7V13Z"
        fill={color}
      />
    </Svg>
  );
}

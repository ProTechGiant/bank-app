import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MediumRiskIcon({ width = 24, height = 24, color = "black" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 3C20 2.44772 20.4477 2 21 2C21.5523 2 22 2.44772 22 3V3.5C22 5.70914 20.2091 7.5 18 7.5C16.8954 7.5 16 8.39543 16 9.5C16 11.7091 14.2091 13.5 12 13.5C10.8954 13.5 10 14.3954 10 15.5C10 17.7091 8.20914 19.5 6 19.5C4.89543 19.5 4 20.3954 4 21.5V22C4 22.5523 3.55228 23 3 23C2.44772 23 2 22.5523 2 22V21.5C2 19.2909 3.79086 17.5 6 17.5C7.10457 17.5 8 16.6046 8 15.5C8 13.2909 9.79086 11.5 12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 7.29086 15.7909 5.5 18 5.5C19.1046 5.5 20 4.60457 20 3.5V3Z"
        fill={color}
      />
    </Svg>
  );
}

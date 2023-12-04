import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function BudgetAngledBorder({ width = 101, height = 109, color = "#5DDBFE" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 101 109" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.4228 -0.00805664H100.979V108.992H2.87148L14.0074 68.3617C15.2306 63.9023 13.945 58.9336 10.8995 56.3463L4.14682 50.6082C0.970207 47.9098 -0.271729 42.6431 1.19072 38.0862L13.4228 -0.00805664Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ReportFraudIcon({ width = 24, height = 24, color = "#FF523D" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3ZM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5H14.9L19 9.1V14.9Z"
        fill={color}
      />
      <Path
        d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
        fill={color}
      />
      <Path d="M11 7H13V14H11V7Z" fill={color} />
    </Svg>
  );
}

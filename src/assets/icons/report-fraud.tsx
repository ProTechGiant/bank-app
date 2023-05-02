import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function ReportFraud({ width = 24, height = 24, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3ZM12 17.3C11.28 17.3 10.7 16.72 10.7 16C10.7 15.28 11.28 14.7 12 14.7C12.72 14.7 13.3 15.28 13.3 16C13.3 16.72 12.72 17.3 12 17.3ZM13 13H11V7H13V13Z"
        fill={color}
      />
    </Svg>
  );
}

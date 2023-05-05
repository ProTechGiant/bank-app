import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function ThumbsDown({ width = 18, height = 18, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11.25 1.5H4.5C3.8775 1.5 3.345 1.875 3.12 2.415L0.855 7.7025C0.7875 7.875 0.75 8.055 0.75 8.25V9.75C0.75 10.575 1.425 11.25 2.25 11.25H6.9825L6.27 14.6775L6.2475 14.9175C6.2475 15.225 6.375 15.51 6.5775 15.7125L7.3725 16.5L12.3075 11.5575C12.585 11.2875 12.75 10.9125 12.75 10.5V3C12.75 2.175 12.075 1.5 11.25 1.5ZM11.25 10.5L7.995 13.755L8.8275 9.75H2.25V8.25L4.5 3H11.25V10.5ZM14.25 1.5H17.25V10.5H14.25V1.5Z"
        fill={color}
      />
    </Svg>
  );
}

import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export const ZoomInIcon = ({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx="17" fill="#FAFAFA" />
      <Path
        d="M15 15V9H13V11.59L9.91 8.5L8.5 9.91L11.59 13H9V15H15ZM27 15V13H24.41L27.5 9.91L26.09 8.5L23 11.59V9H21V15H27ZM9 21V23H11.59L8.5 26.09L9.91 27.5L13 24.41V27H15V21H9ZM21 21V27H23V24.41L26.09 27.5L27.5 26.09L24.41 23H27V21H21Z"
        fill={color}
      />
    </Svg>
  );
};

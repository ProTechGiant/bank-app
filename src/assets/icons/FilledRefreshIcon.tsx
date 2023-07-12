import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function FilledRefreshIcon({ width = 24, height = 24, color = "#FFF0DC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="12" cy="12" r="12" fill="black" />
      <G clip-path="url(#clip0_3931_21262)">
        <Path
          d="M12 7.5V5.8125L9.75 8.0625L12 10.3125V8.625C13.8619 8.625 15.375 10.1381 15.375 12C15.375 12.5681 15.2344 13.1081 14.9812 13.575L15.8025 14.3963C16.2413 13.7044 16.5 12.8831 16.5 12C16.5 9.51375 14.4863 7.5 12 7.5ZM12 15.375C10.1381 15.375 8.625 13.8619 8.625 12C8.625 11.4319 8.76562 10.8919 9.01875 10.425L8.1975 9.60375C7.75875 10.2956 7.5 11.1169 7.5 12C7.5 14.4863 9.51375 16.5 12 16.5V18.1875L14.25 15.9375L12 13.6875V15.375Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3931_21262">
          <Rect width="13.5" height="13.5" fill="#ffffff" transform="translate(5.25 5.25)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function LikeSmallIcon({ width = 36, height = 36, color = "#2E2E2E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx="18" fill="#FAFAFA" fill-opacity="0.6" />
      <Path
        d="M22.5 8.82422C20.76 8.82422 19.09 9.63422 18 10.9142C16.91 9.63422 15.24 8.82422 13.5 8.82422C10.42 8.82422 8 11.2442 8 14.3242C8 18.1042 11.4 21.1842 16.55 25.8642L18 27.1742L19.45 25.8542C24.6 21.1842 28 18.1042 28 14.3242C28 11.2442 25.58 8.82422 22.5 8.82422ZM18.1 24.3742L18 24.4742L17.9 24.3742C13.14 20.0642 10 17.2142 10 14.3242C10 12.3242 11.5 10.8242 13.5 10.8242C15.04 10.8242 16.54 11.8142 17.07 13.1842H18.94C19.46 11.8142 20.96 10.8242 22.5 10.8242C24.5 10.8242 26 12.3242 26 14.3242C26 17.2142 22.86 20.0642 18.1 24.3742Z"
        fill={color}
      />
    </Svg>
  );
}

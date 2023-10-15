import Svg, { Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function EyeShowIcon({ width = 34, height = 34, color = "#FAFAFA" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={width} height={height} rx={17} fill={color} fillOpacity={0.3} />
      <Path
        d="M17 12.875C19.8425 12.875 22.3775 14.4725 23.615 17C22.3775 19.5275 19.85 21.125 17 21.125C14.15 21.125 11.6225 19.5275 10.385 17C11.6225 14.4725 14.1575 12.875 17 12.875ZM17 11.375C13.25 11.375 10.0475 13.7075 8.75 17C10.0475 20.2925 13.25 22.625 17 22.625C20.75 22.625 23.9525 20.2925 25.25 17C23.9525 13.7075 20.75 11.375 17 11.375ZM17 15.125C18.035 15.125 18.875 15.965 18.875 17C18.875 18.035 18.035 18.875 17 18.875C15.965 18.875 15.125 18.035 15.125 17C15.125 15.965 15.965 15.125 17 15.125ZM17 13.625C15.14 13.625 13.625 15.14 13.625 17C13.625 18.86 15.14 20.375 17 20.375C18.86 20.375 20.375 18.86 20.375 17C20.375 15.14 18.86 13.625 17 13.625Z"
        fill={color}
      />
    </Svg>
  );
}

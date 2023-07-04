import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function EatingOutIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M7.79945 13.1285L10.6295 10.2985L3.60945 3.28853C2.04945 4.84853 2.04945 7.37853 3.60945 8.94853L7.79945 13.1285ZM14.5795 11.3185C16.1095 12.0285 18.2595 11.5285 19.8495 9.93853C21.7595 8.02853 22.1295 5.28853 20.6595 3.81853C19.1995 2.35853 16.4595 2.71853 14.5395 4.62853C12.9495 6.21853 12.4495 8.36853 13.1595 9.89853L3.39945 19.6585L4.80945 21.0685L11.6995 14.1985L18.5795 21.0785L19.9895 19.6685L13.1095 12.7885L14.5795 11.3185Z"
        fill={color}
      />
    </Svg>
  );
}

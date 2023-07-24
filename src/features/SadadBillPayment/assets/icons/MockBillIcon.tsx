import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function PaymentHistoryIcon({ color = "#FF7512", height = 24, width = 24 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.5 3C8.53 3 4.5 7.03 4.5 12H1.5L5.39 15.89L5.46 16.03L9.5 12H6.5C6.5 8.13 9.63 5 13.5 5C17.37 5 20.5 8.13 20.5 12C20.5 15.87 17.37 19 13.5 19C11.57 19 9.82 18.21 8.56 16.94L7.14 18.36C8.77 19.99 11.01 21 13.5 21C18.47 21 22.5 16.97 22.5 12C22.5 7.03 18.47 3 13.5 3ZM12.5 8V13L16.75 15.52L17.52 14.24L14 12.15V8H12.5Z"
        fill={color}
      />
    </Svg>
  );
}

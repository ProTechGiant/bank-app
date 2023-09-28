import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function EndDateIcon({ width = 24, height = 22, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5.68 12.19L8 10.43L10.31 12.19L9.43 9.34L11.75 7.5H8.91L8 4.69L7.09 7.5H4.25L6.56 9.34L5.68 12.19ZM16 8.5C16 4.08 12.42 0.5 8 0.5C3.58 0.5 0 4.08 0 8.5C0 10.53 0.76 12.37 2 13.78V21.5L8 19.5L14 21.5V13.78C15.24 12.37 16 10.53 16 8.5ZM8 2.5C11.31 2.5 14 5.19 14 8.5C14 11.81 11.31 14.5 8 14.5C4.69 14.5 2 11.81 2 8.5C2 5.19 4.69 2.5 8 2.5ZM8 17.5L4 18.52V15.42C5.18 16.1 6.54 16.5 8 16.5C9.46 16.5 10.82 16.1 12 15.42V18.52L8 17.5Z"
        fill={color}
      />
    </Svg>
  );
}

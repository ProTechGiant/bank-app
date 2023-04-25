import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function Bookmark({ color = "#00A0CC", height = 24, width = 25 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z"
        fill={color}
      />
    </Svg>
  );
}

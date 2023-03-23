import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function Clear({ color = "#7D7D7D", height = 21, width = 20 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 0.5C4.47 0.5 0 4.97 0 10.5C0 16.03 4.47 20.5 10 20.5C15.53 20.5 20 16.03 20 10.5C20 4.97 15.53 0.5 10 0.5ZM15 14.09L13.59 15.5L10 11.91L6.41 15.5L5 14.09L8.59 10.5L5 6.91L6.41 5.5L10 9.09L13.59 5.5L15 6.91L11.41 10.5L15 14.09Z"
        fill={color}
      />
    </Svg>
  );
}

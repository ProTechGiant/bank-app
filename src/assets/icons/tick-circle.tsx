import { Path, Svg } from "react-native-svg";

import { IconProps } from "./index";

export default function TickCircle({ color = "white", height = 80, width = 80 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M40.0003 6.66699C21.6003 6.66699 6.66699 21.6003 6.66699 40.0003C6.66699 58.4003 21.6003 73.3337 40.0003 73.3337C58.4003 73.3337 73.3337 58.4003 73.3337 40.0003C73.3337 21.6003 58.4003 6.66699 40.0003 6.66699ZM33.3337 56.667L16.667 40.0003L21.367 35.3003L33.3337 47.2337L58.6337 21.9337L63.3337 26.667L33.3337 56.667Z"
        fill={color}
      />
    </Svg>
  );
}

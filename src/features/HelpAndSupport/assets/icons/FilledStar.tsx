import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function FilledStar({ color = "#002233", width = 38, height = 38 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 38 38" fill="none">
      <Path
        d="M19.0013 28.1355L28.7863 34.0413L26.1896 22.9105L34.8346 15.4213L23.4505 14.4555L19.0013 3.95801L14.5521 14.4555L3.16797 15.4213L11.813 22.9105L9.2163 34.0413L19.0013 28.1355Z"
        fill={color}
      />
    </Svg>
  );
}

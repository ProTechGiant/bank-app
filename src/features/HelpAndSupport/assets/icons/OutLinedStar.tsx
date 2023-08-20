import { Path, Svg } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function OutLinedStar({ color = "#002233", width = 38, height = 38 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 38 38" fill="none">
      <Path
        d="M34.8346 15.4213L23.4505 14.4397L19.0013 3.95801L14.5521 14.4555L3.16797 15.4213L11.813 22.9105L9.2163 34.0413L19.0013 28.1355L28.7863 34.0413L26.2055 22.9105L34.8346 15.4213ZM19.0013 25.1747L13.048 28.7688L14.6313 21.9922L9.37464 17.4322L16.3096 16.8305L19.0013 10.4497L21.7088 16.8463L28.6438 17.448L23.3871 22.008L24.9705 28.7847L19.0013 25.1747Z"
        fill={color}
      />
    </Svg>
  );
}

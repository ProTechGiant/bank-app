import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function CashbackIcon({ color = "#1E1A25", height = 24, width = 24 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.07578 20.2001C3.44245 20.2001 2.90478 19.9794 2.46278 19.538C2.02145 19.096 1.80078 18.5584 1.80078 17.925V6.07505C1.80078 5.44172 2.02145 4.90405 2.46278 4.46205C2.90478 4.02072 3.44245 3.80005 4.07578 3.80005H19.9258C20.5591 3.80005 21.0968 4.02072 21.5388 4.46205C21.9801 4.90405 22.2008 5.44172 22.2008 6.07505V17.925C22.2008 18.5584 21.9801 19.096 21.5388 19.538C21.0968 19.9794 20.5591 20.2001 19.9258 20.2001H4.07578ZM4.07578 7.97505V11.975H19.9258V7.97505H4.07578Z"
        fill={color}
      />
    </Svg>
  );
}

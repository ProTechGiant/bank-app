import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChatIcon({ color = "#1E1A25", height = 24, width = 25 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.65002 16.3585V3.38352C1.65002 3.06685 1.76269 2.79585 1.98802 2.57052C2.21269 2.34585 2.48336 2.23352 2.80002 2.23352H15.925C16.2417 2.23352 16.5127 2.34585 16.738 2.57052C16.9627 2.79585 17.075 3.06685 17.075 3.38352V12.5085C17.075 12.8252 16.9627 13.0919 16.738 13.3085C16.5127 13.5252 16.2417 13.6335 15.925 13.6335H5.75002L2.62502 16.7585C2.44169 16.9585 2.23336 17.0085 2.00002 16.9085C1.76669 16.8085 1.65002 16.6252 1.65002 16.3585ZM7.02502 18.9085C6.70836 18.9085 6.44169 18.8002 6.22502 18.5835C6.00836 18.3669 5.90002 18.1002 5.90002 17.7835V15.6335H19.075V6.48352H21.2C21.5167 6.48352 21.7877 6.59185 22.013 6.80852C22.2377 7.02519 22.35 7.29185 22.35 7.60852V21.5835C22.35 21.8502 22.2334 22.0335 22 22.1335C21.7667 22.2335 21.5584 22.1919 21.375 22.0085L18.275 18.9085H7.02502ZM14.8 4.50852H3.92502V11.3585H14.8V4.50852Z"
        fill={color}
      />
    </Svg>
  );
}

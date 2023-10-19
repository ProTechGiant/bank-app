import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function CashMarketIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M3 8c-.55 0-.995.45-.995 1S2.45 10 3 10s1-.45 1-1-.45-1-1-1zm5 0c-.55 0-.995.45-.995 1S7.45 10 8 10s1-.45 1-1-.45-1-1-1zm-.725-2.5a.995.995 0 00.875-.515L9.94 1.74A.498.498 0 009.505 1h-7.4l-.47-1H0v1h1l1.8 3.795-.675 1.22C1.76 6.685 2.24 7.5 3 7.5h6v-1H3l.55-1h3.725zM2.58 2h6.075l-1.38 2.5h-3.51L2.58 2z"
        fill="#2E2E2E"
      />
    </Svg>
  );
}

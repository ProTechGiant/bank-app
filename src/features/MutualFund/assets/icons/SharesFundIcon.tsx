import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function SharesFundIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9 0H1C.45 0 0 .45 0 1v6c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1zm0 7H1V1h8v6z"
        fill="#2E2E2E"
      />
      <Path
        d="M3.145 5.855c-.51-.51-.77-1.18-.77-1.855s.26-1.345.765-1.86l-.615-.615A3.478 3.478 0 001.5 4c0 .895.34 1.795 1.03 2.47l.615-.615zM5 5.75c.965 0 1.75-.785 1.75-1.75S5.965 2.25 5 2.25 3.25 3.035 3.25 4 4.035 5.75 5 5.75zm0-2.5a.749.749 0 110 1.5.749.749 0 110-1.5zM6.86 5.86l.615.615A3.478 3.478 0 008.5 4c0-.895-.34-1.795-1.03-2.47l-.615.615c.51.51.77 1.18.77 1.855s-.26 1.345-.765 1.86z"
        fill="#2E2E2E"
      />
    </Svg>
  );
}

import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function SoukIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.5 5.25H10L5 .75l-5 4.5h1.5v1.5h-1v1h1v1.5h1v-1.5h2v1.5h1v-1.5h2v1.5h1v-1.5h1v-1h-1v-1.5zm-6 1.5V4.345l2-1.8V6.75h-2zm3 0V2.545l2 1.8V6.75h-2z"
        fill="#2E2E2E"
      />
    </Svg>
  );
}

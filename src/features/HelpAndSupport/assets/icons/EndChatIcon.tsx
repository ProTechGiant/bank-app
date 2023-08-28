import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

function EndChatIcon() {
  return (
    <Svg width={36} height={44} viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect y={4} width={36} height={36} rx={18} fill="#2E2E2E" fillOpacity={0.12} />
      <Path
        d="M25 16.41L23.59 15 18 20.59 12.41 15 11 16.41 16.59 22 11 27.59 12.41 29 18 23.41 23.59 29 25 27.59 19.41 22 25 16.41z"
        fill="#2E2E2E"
      />
    </Svg>
  );
}

export default EndChatIcon;

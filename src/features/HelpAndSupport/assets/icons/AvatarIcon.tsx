import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

function AvatarIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white" />
      <Rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#FF371E" />
      <G clip-path="url(#clip0_2871_12267)">
        <Path
          d="M21.2445 10.6415L21.9988 10.2121V21.789L21.2445 21.3574L18.1217 19.5735V23.9989L8 18.2167L8.76017 17.785L11.8807 16.0011L18.1228 19.5678V12.4299L11.8783 15.9989L8.76017 14.2184L8 13.7845L18.1228 8V12.4254L21.2456 10.6415H21.2445Z"
          fill="#FF371E"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2871_12267">
          <Rect width="14" height="16" fill="white" transform="translate(8 8)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default AvatarIcon;

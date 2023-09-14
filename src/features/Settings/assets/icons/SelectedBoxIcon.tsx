import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function SelectedBoxIcon() {
  return (
    <Svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 3.5H5C3.89 3.5 3 4.4 3 5.5V19.5C3 20.6 3.89 21.5 5 21.5H19C20.11 21.5 21 20.6 21 19.5V5.5C21 4.4 20.11 3.5 19 3.5ZM10 17.5L5 12.5L6.41 11.09L10 14.67L17.59 7.08L19 8.5L10 17.5Z"
        fill="#FF371E"
      />
    </Svg>
  );
}

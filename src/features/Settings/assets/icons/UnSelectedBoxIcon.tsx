import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function UnSelectedBoxIcon() {
  return (
    <Svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 5.5V19.5H5V5.5H19ZM19 3.5H5C3.9 3.5 3 4.4 3 5.5V19.5C3 20.6 3.9 21.5 5 21.5H19C20.1 21.5 21 20.6 21 19.5V5.5C21 4.4 20.1 3.5 19 3.5Z"
        fill="#B3B3B3"
      />
    </Svg>
  );
}

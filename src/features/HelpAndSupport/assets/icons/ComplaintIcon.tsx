import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/assets/icons";

export default function FraudIcon({ width = 24, height = 24, color = "#FF371E" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6.48375 2.29453H19.6537C20.7638 2.29453 21.6537 3.18453 21.6537 4.29453V16.2945C21.6537 16.6345 21.5737 16.9545 21.4237 17.2345L19.6537 15.4645V10.2945H14.4838L10.4838 6.29453H19.6537V4.29453H8.48375L6.48375 2.29453ZM20.1437 21.6045L16.8237 18.2945H3.65375C2.54375 18.2945 1.65375 17.4045 1.65375 16.2945L1.66375 4.29453C1.66375 3.95453 1.74375 3.63453 1.89375 3.36453L0.34375 1.80453L1.75375 0.394531L21.5537 20.1945L20.1437 21.6045ZM3.65375 5.12453V6.29453H4.82375L3.65375 5.12453ZM14.8238 16.2945L8.82375 10.2945H3.65375V16.2945H14.8238Z"
        fill={color}
      />
    </Svg>
  );
}

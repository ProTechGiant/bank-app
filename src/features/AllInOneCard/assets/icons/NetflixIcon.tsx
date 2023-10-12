import Svg, { Defs, Image, Pattern, Rect, Use } from "react-native-svg";

import type { IconProps } from "@/assets/icons";
// import { Rect } from "victory-native";

export default function NetflixIcon({ width = 25, height = 24 }: IconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <Rect x="0.621094" width="25" height="24" fill="url(#pattern0)" />
      <Defs>
        <Pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <Use xlinkHref="#image0_5303_543160" transform="matrix(0.00444444 0 0 0.00462963 0 -0.0208333)" />
        </Pattern>
        <Image
          id="image0_5303_543160"
          width="225"
          height="225"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}

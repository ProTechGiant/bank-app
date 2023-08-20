import * as React from "react";
import Svg, { Defs, Pattern, Rect, Use } from "react-native-svg";

function SenderAvatarIcon() {
  return (
    <Svg
      width={42}
      height={42}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} fill="url(#pattern0)" />
      <Rect x={29.25} y={29.25} width={11.5} height={11.5} rx={5.75} fill="#00BCA5" />
      <Rect x={29.25} y={29.25} width={11.5} height={11.5} rx={5.75} stroke="#fff" strokeWidth={1.5} />
      <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} stroke="#FF371E" />
      <Defs>
        <Pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <Use xlinkHref="#image0_3115_15846" transform="scale(.00444)" />
        </Pattern>
      </Defs>
    </Svg>
  );
}

export default SenderAvatarIcon;

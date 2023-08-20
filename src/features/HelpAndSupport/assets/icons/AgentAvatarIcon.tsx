import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

function AgentAvatarIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} fill="#fff" />
      <Rect x={29.25} y={29.25} width={11.5} height={11.5} rx={5.75} fill="#03C04A" />
      <Rect x={29.25} y={29.25} width={11.5} height={11.5} rx={5.75} stroke="#fff" strokeWidth={1.5} />
      <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} stroke="#FF371E" />
      <G clipPath="url(#clip0_3115_15842)">
        <Path
          d="M25.244 14.642l.755-.43V25.79l-.755-.432-3.122-1.784V28L12 22.217l.76-.432 3.12-1.784 6.243 3.567V16.43l-6.245 3.569-3.118-1.78-.76-.434L22.123 12v4.425l3.123-1.784h-.002z"
          fill="#FF371E"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3115_15842">
          <Path fill="#fff" transform="translate(12 12)" d="M0 0H14V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default AgentAvatarIcon;

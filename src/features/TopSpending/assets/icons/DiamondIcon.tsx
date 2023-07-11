import Svg, { G, Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function DiamondIcon({ width = 19, height = 19, color = "#00A0CC" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G id="diamond">
        <Path
          d="M15.8333 2.5H4.16663L1.66663 7.5L9.99996 17.5L18.3333 7.5L15.8333 2.5ZM8.01663 6.66667L9.26663 4.16667H10.7333L11.9833 6.66667H8.01663ZM9.16663 8.33333V13.9L4.53329 8.33333H9.16663ZM10.8333 8.33333H15.4666L10.8333 13.9V8.33333ZM16.05 6.66667H13.8416L12.5916 4.16667H14.8L16.05 6.66667ZM5.19996 4.16667H7.40829L6.15829 6.66667H3.94996L5.19996 4.16667Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

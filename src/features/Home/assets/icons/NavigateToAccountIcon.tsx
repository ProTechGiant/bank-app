import Svg, { G, Mask, Path } from "react-native-svg";
import { Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function NavigateToAccountIcon({ width = 20, height = 20, color = "#F1F1F4" }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Mask
        id="mask0_15948_102052"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="20"
        height="20">
        <Rect width="20" height="20" fill="#D9D9D9" />
      </Mask>
      <G mask="url(#mask0_15948_102052)">
        <Path
          d="M10.7156 9.99992L7.37864 6.66296C7.20261 6.48693 7.11459 6.28328 7.11459 6.052C7.11459 5.82072 7.20261 5.61707 7.37864 5.44104C7.55466 5.26502 7.75832 5.177 7.98959 5.177C8.22087 5.177 8.42688 5.26736 8.60761 5.44809L12.5539 9.3944C12.6333 9.47936 12.6945 9.57389 12.7376 9.678C12.7806 9.7821 12.8021 9.89079 12.8021 10.0041C12.8021 10.1174 12.7806 10.2261 12.7376 10.3302C12.6945 10.4343 12.6333 10.526 12.5539 10.6054L8.60761 14.5518C8.42688 14.7325 8.22434 14.8194 8.00001 14.8124C7.77568 14.8055 7.5755 14.714 7.39947 14.538C7.22344 14.3619 7.13543 14.1583 7.13543 13.927C7.13543 13.6957 7.22344 13.4921 7.39947 13.316L10.7156 9.99992Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function ChevronRightIcon({ color = "#FF5B00", height = 13, width = 8 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M7.58231 6.49633C7.58231 6.21578 7.47967 5.98313 7.2607 5.76416L1.9918 0.611586C1.81389 0.433675 1.60176 0.351562 1.34858 0.351562C0.835375 0.351562 0.417969 0.755284 0.417969 1.26849C0.417969 1.52167 0.527452 1.75432 0.712206 1.93908L5.39263 6.48949L0.712206 11.0536C0.527452 11.2383 0.417969 11.4642 0.417969 11.7242C0.417969 12.2374 0.835375 12.6479 1.34858 12.6479C1.60176 12.6479 1.81389 12.559 1.9918 12.3811L7.2607 7.22851C7.48651 7.00954 7.58231 6.77689 7.58231 6.49633Z"
        fill={color}
      />
    </Svg>
  );
}

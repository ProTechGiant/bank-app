import { Path, Svg } from "react-native-svg";

import type { IconProps } from "./index";

export default function CancelCircleBorder({ color = "#C50707", height = 50, width = 50 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M25.0001 4.16675C13.4792 4.16675 4.16675 13.4792 4.16675 25.0001C4.16675 36.5209 13.4792 45.8334 25.0001 45.8334C36.5209 45.8334 45.8334 36.5209 45.8334 25.0001C45.8334 13.4792 36.5209 4.16675 25.0001 4.16675ZM25.0001 41.6667C15.8126 41.6667 8.33341 34.1876 8.33341 25.0001C8.33341 15.8126 15.8126 8.33341 25.0001 8.33341C34.1876 8.33341 41.6667 15.8126 41.6667 25.0001C41.6667 34.1876 34.1876 41.6667 25.0001 41.6667ZM32.4792 14.5834L25.0001 22.0626L17.5209 14.5834L14.5834 17.5209L22.0626 25.0001L14.5834 32.4792L17.5209 35.4167L25.0001 27.9376L32.4792 35.4167L35.4167 32.4792L27.9376 25.0001L35.4167 17.5209L32.4792 14.5834Z"
        fill={color}
      />
    </Svg>
  );
}

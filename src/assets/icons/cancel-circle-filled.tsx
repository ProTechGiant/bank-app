import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

import type { IconProps } from "./index";

export default function CancelCircleFilledIcon({ width = 78, height = 81 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 78 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_6791_54462)">
        <Path
          d="M70.5356 21.4231L70.5417 21.4293L67.0675 16.5205L65.5438 16.072C59.1022 10.4137 50.6577 6.98242 41.4115 6.98242C21.2019 6.98242 4.81982 23.3645 4.81982 43.5741C4.81982 48.8638 5.94412 53.8863 7.96231 58.4264L6.05777 56.9765L11.2768 64.3366C17.8782 73.8962 28.9091 80.1627 41.4084 80.1627C61.618 80.1627 78.0001 63.7806 78.0001 43.571C78.0001 35.2464 75.217 27.5699 70.5356 21.4231Z"
          fill="#821717"
        />
        <Path
          d="M36.5917 73.1834C56.8007 73.1834 73.1834 56.8007 73.1834 36.5917C73.1834 16.3827 56.8007 0 36.5917 0C16.3827 0 0 16.3827 0 36.5917C0 56.8007 16.3827 73.1834 36.5917 73.1834Z"
          fill="#F7DCDC"
        />
        <Path d="M48.5065 19.0616L20.22 46.8394L24.9615 51.6678L53.2481 23.89L48.5065 19.0616Z" fill="#821717" />
        <Path d="M24.9615 19.0642L20.22 23.8926L48.5065 51.6703L53.2481 46.8419L24.9615 19.0642Z" fill="#821717" />
      </G>
      <Defs>
        <ClipPath id="clip0_6791_54462">
          <Rect width="78" height="80.1626" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

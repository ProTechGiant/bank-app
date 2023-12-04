import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function MatchingIdFound({ width = 220, height = 210 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 220 210" fill="none">
      <G clip-path="url(#clip0_31463_95921)">
        <Path
          d="M23.6026 7.40306L35.7688 37.991C36.3305 39.3913 37.9193 40.0827 39.3238 39.5226L46.1705 36.8095C47.3994 36.3194 48.1104 35.0241 47.8471 33.7376L41.4656 2.04689C41.1671 0.567813 39.6574 -0.324883 38.2178 0.103961L25.2441 4.00732C23.8133 4.43616 23.0496 6.00275 23.6026 7.39431"
          fill="#39FDDC"
        />
        <Path
          d="M219.358 156.43L194.49 129.929C193.744 129.098 192.392 128.599 191.19 128.704L185.414 129.22C184.238 129.325 183.623 129.982 183.518 130.84C178.98 167.134 137.144 187.219 105.175 190.326C102.682 190.571 100.909 192.497 101.199 194.615L102.744 206.115C103.042 208.294 105.404 209.861 107.958 209.519C159.396 202.509 190.382 163.607 190.549 138.865L207.28 159.756C208.289 160.911 210.194 161.436 211.528 160.937L218.858 159.38C220.166 158.881 220.394 157.559 219.367 156.43"
          fill="#1E1A25"
        />
        <Path
          d="M95.1445 135.33C92.6253 139.425 89.7022 140.353 82.5658 140.353C74.8501 140.353 74.025 137.045 71.7076 132.415C67.5118 123.996 59.9891 109.958 50.7021 97.1274C49.2187 95.0795 49.8858 92.5239 52.1768 91.3687L60.3841 87.2465C62.6752 86.0913 65.7913 86.8527 67.3011 88.9094C74.4638 98.694 80.2485 110.334 84.7691 118.57C101.947 93.1803 136.357 67.7385 154.053 57.0612C140.14 44.6597 120.082 36.713 97.9447 36.4591C57.6015 35.9865 19.6636 61.7784 14.2652 98.1514C8.05042 140.003 46.4888 176.008 98.2344 172.674C147.162 169.523 180.035 132.45 174.716 94.6507C173.373 85.0848 169.792 76.4292 164.604 68.9288C146.732 80.5163 112.367 107.306 95.1357 135.321"
          fill="#FF523D"
        />
        <Path
          d="M1.06272 47.066L20.5321 55.4066C21.5503 55.8442 22.7353 55.5029 23.3673 54.6014L26.8609 49.6391C27.607 48.5888 27.3437 47.1273 26.2903 46.3921L7.82169 33.4568C6.92634 32.8354 5.68866 33.1592 5.21466 34.1394L0.176155 44.6942C-0.253961 45.5957 0.149821 46.6722 1.0715 47.066"
          fill="#39FDDC"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_31463_95921">
          <Rect width="220" height="209.573" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

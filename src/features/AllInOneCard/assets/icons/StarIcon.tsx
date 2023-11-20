import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export default function StarIcon({ width = 22, height = 22, color = "#000" }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M4.53693 19.4648C4.87726 19.7305 5.3089 19.6392 5.82355 19.2656L10.2147 16.0366L14.6141 19.2656C15.1287 19.6392 15.5521 19.7305 15.9007 19.4648C16.241 19.2075 16.3157 18.7842 16.1082 18.1782L14.3734 13.0151L18.806 9.82764C19.3206 9.4624 19.5281 9.08057 19.3953 8.66553C19.2625 8.26709 18.8724 8.06787 18.2332 8.07617L12.7962 8.10938L11.1444 2.92139C10.9451 2.30713 10.6463 2 10.2147 2C9.79133 2 9.4925 2.30713 9.29328 2.92139L7.64142 8.10938L2.20441 8.07617C1.56525 8.06787 1.17511 8.26709 1.0423 8.66553C0.901188 9.08057 1.11701 9.4624 1.63166 9.82764L6.06427 13.0151L4.32941 18.1782C4.12189 18.7842 4.1966 19.2075 4.53693 19.4648Z"
        fill={color}
      />
    </Svg>
  );
}

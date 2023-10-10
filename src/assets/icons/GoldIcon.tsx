import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

export function GoldIcon({ width = 100, height = 100 }: IconProps) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 97 97" fill="none">
      <G clip-path="url(#clip0_15564_10128)">
        <Path
          d="M66.3648 33.4598L52.751 30.057L7.01858 50.0504L0 64.0891L23.8298 70.9332L73.1704 48.9908L66.3648 33.4598Z"
          fill="#D83C23"
        />
        <Path d="M66.3634 33.4598L20.418 53.8825L23.8283 70.9332L73.169 48.9908L66.3634 33.4598Z" fill="#EC5F48" />
        <Path d="M20.4205 53.8825L7.01964 50.0505L0.00390625 64.0892L23.8308 70.9332L20.4205 53.8825Z" fill="#AC2711" />
        <Path
          d="M90.1929 40.3026L76.5791 36.8983L30.8467 56.893L23.8281 70.9332L47.6575 77.7714L96.9983 55.8305L90.1929 40.3026Z"
          fill="#D83C23"
        />
        <Path d="M90.1956 40.3026L44.25 60.7206L47.6602 77.7714L97.001 55.8305L90.1956 40.3026Z" fill="#EC5F48" />
        <Path d="M44.2474 60.7207L30.8467 56.893L23.8281 70.9332L47.6576 77.7714L44.2474 60.7207Z" fill="#AC2711" />
        <Path
          d="M75.1021 22.6314L61.4909 19.2288L19.6839 37.6028L12.668 51.6415L36.4978 58.4827L81.9105 38.1607L75.1021 22.6314Z"
          fill="#D83C23"
        />
        <Path d="M75.1004 22.6314L33.0859 41.4318L36.4961 58.4827L81.9089 38.1607L75.1004 22.6314Z" fill="#EC5F48" />
        <Path d="M33.0876 41.4318L19.6839 37.6028L12.668 51.6415L36.4978 58.4827L33.0876 41.4318Z" fill="#AC2711" />
      </G>
      <Defs>
        <ClipPath id="clip0_15564_10128">
          <Rect width={width} height={height} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

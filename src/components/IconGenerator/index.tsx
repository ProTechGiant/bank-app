import { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

interface IconGeneratorProps {
  color?: ColorValue;
  height?: number | string;
  width?: number | string;
  viewBox?: string;
  path: string;
}

export default function IconGenerator({
  width = 42,
  height = 42,
  viewBox = "0 0 19 22",
  color = "#282F86",
  path,
}: IconGeneratorProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d={path} fill={color} />
    </Svg>
  );
}

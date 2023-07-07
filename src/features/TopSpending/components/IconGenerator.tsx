import Svg, { Path } from "react-native-svg";

interface IconGeneratorProps {
  color?: ColorValue;
  height?: number | string;
  width?: number | string;
  path: string;
}

export default function IconGenerator({ width = 42, height = 42, color = "#282F86", path }: IconGeneratorProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d={path} fill={color} />
    </Svg>
  );
}

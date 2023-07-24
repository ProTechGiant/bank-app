import { StyleSheet } from "react-native";
import { ColorValue } from "react-native/types";
import Svg, { Path } from "react-native-svg";

interface BackgroundBottomProps {
  color?: ColorValue;
}

const SVG_WIDTH = 390;
const SVG_HEIGHT = 24;
const aspectRatio = SVG_WIDTH / SVG_HEIGHT;

export default function BackgroundBottom({ color = "#5DDBFE" }: BackgroundBottomProps) {
  return (
    <Svg
      style={styles.container}
      width="100%"
      height="100%"
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      fill="none"
      preserveAspectRatio="xMaxYMin slice"
      xmlns="http://www.w3.org/2000/svg">
      <Path d="M390 24L2.9235e-05 8.80171L-2.02532e-06 -4.54318e-06L390 -7.62939e-06L390 24Z" fill={color} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio,
    width: "100%",
  },
});

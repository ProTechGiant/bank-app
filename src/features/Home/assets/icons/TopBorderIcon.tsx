import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

import type { IconProps } from "@/assets/icons";

const SVG_WIDTH = 390;
const SVG_HEIGHT = 30;

export default function TopBorderIcon({ color = "#FAFAFA" }: IconProps) {
  return (
    <Svg
      style={styles.container}
      width="100%"
      height="100%"
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M390.257 30.3916H0V7.6827L359.109 0.78916C377.122 0.443417 389.73 14.8221 390.257 30.3916Z"
        fill={color}
      />
    </Svg>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

import { cloneElement } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { useThemeStyles } from "@/theme";

interface EndButtonProps {
  icon: React.ReactElement<SvgProps>;
  height?: number;
  width?: number;
}

export default function EndButton({ icon, height = 20, width = 20 }: EndButtonProps) {
  const iconColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  return <View style={styles.button}>{cloneElement(icon, { color: iconColor, height: height, width: width })}</View>;
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#00000014",
    borderRadius: 16,
    borderWidth: 0,
    height: 32,
    justifyContent: "center",
    padding: 6,
    width: 32,
  },
});

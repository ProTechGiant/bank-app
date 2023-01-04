import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { spaceMap } from "@/theme/mappings";

type Props = {
  children: ReactNode;
  backgroundColor?: "none" | "bisque";
  padding?: keyof typeof spaceMap;
  width?: string | number;
};

export const Box = ({ children, backgroundColor = "none", padding = "none", width = "100%" }: Props) => {
  return <View style={[boxStyles.box, { backgroundColor, padding: spaceMap[padding], width }]}>{children}</View>;
};

const boxStyles = StyleSheet.create({
  box: {},
});

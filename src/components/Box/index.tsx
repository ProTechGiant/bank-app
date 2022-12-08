import { spaceMap } from "@/utils";
import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

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

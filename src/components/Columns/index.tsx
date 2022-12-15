import { flexMap, spaceMap } from "@/utils/mappings";
import { cloneElement } from "react";
import { View, StyleSheet } from "react-native";

export const Columns = ({ children, space = "none" }: { children: React.ReactNode; space?: keyof typeof spaceMap }) => {
  if (children instanceof Array) {
    const clonedChildren = children.map((child, index) =>
      cloneElement(child, { key: index, isLast: index === children.length - 1, marginRight: space })
    );

    return <View style={styles.columns}>{clonedChildren}</View>;
  }

  return <View style={styles.columns}>{children}</View>;
};

export const Column = ({
  children,
  flex,
  isLast = false,
  marginRight = "none",
}: {
  children: React.ReactNode;
  flex: keyof typeof flexMap;
  isLast?: boolean;
  marginRight?: keyof typeof spaceMap;
}) => {
  return (
    <View style={[styles.column, { flex: flexMap[flex] }, !isLast && { marginRight: spaceMap[marginRight] }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  columns: {
    width: "100%",
    flexDirection: "row",
  },
  column: {},
});

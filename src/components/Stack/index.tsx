import { spaceMap } from "@/utils";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export const Stack = ({
  children,
  space = "none",
  xAlign = "flex-start",
}: {
  children: ReactNode | ReactNode[];
  space?: keyof typeof spaceMap;
  xAlign?: "flex-start" | "center" | "flex-end";
}) => {
  if (children instanceof Array) {
    return (
      <View style={[stackStyles.container, xAlign && { alignItems: xAlign }]}>
        {children.map((child, index) => (
          <View style={{ marginBottom: children.length - 1 === index ? 0 : spaceMap[space] }} key={index}>
            {child}
          </View>
        ))}
      </View>
    );
  }

  return <View style={stackStyles.container}>{children}</View>;
};

const stackStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

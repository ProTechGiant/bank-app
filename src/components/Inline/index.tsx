import { spaceMap } from "@/utils";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export const Inline = ({
  children,
  space = "none",
}: {
  children: ReactNode | ReactNode[];
  space?: keyof typeof spaceMap;
}) => {
  if (children instanceof Array) {
    return (
      <View
        style={[
          inlineStyles.container,
          {
            marginLeft: -spaceMap[space],
            marginTop: -spaceMap[space],
          },
        ]}>
        {children.map((child, index) => (
          <View
            style={{
              marginLeft: spaceMap[space],
              marginTop: spaceMap[space],
            }}
            key={index}>
            {child}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={inlineStyles.container}>
      <View>{children}</View>
    </View>
  );
};

const inlineStyles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

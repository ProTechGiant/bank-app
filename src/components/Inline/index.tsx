import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { spaceMap } from "@/theme/mappings";

type Props = {
  children: ReactNode | ReactNode[];
  space?: keyof typeof spaceMap;
  xAlign?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
};

export const Inline = ({ children, space = "none", xAlign }: Props) => {
  if (children instanceof Array) {
    return (
      <View
        style={[
          inlineStyles.container,
          {
            marginLeft: -spaceMap[space],
            marginTop: -spaceMap[space],
          },
          xAlign && { justifyContent: xAlign },
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
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
});

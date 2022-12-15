import { spaceMap } from "@/utils/mappings";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: ReactNode | ReactNode[];
  space?: keyof typeof spaceMap;
  xAlign?: "flex-start" | "center" | "flex-end";
};

export const Stack = ({ children, space = "none", xAlign }: Props) => {
  if (children instanceof Array) {
    return (
      <View style={[stackStyles.container]}>
        {children.map((child, index) => (
          <View
            style={[
              stackStyles.child,
              { marginBottom: children.length - 1 === index ? 0 : spaceMap[space] },
              xAlign && { alignItems: xAlign },
            ]}
            key={index}>
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
  child: {
    width: "100%",
  },
});

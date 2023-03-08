import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { styles } from "./Styles";

interface TableListCardGroupProps {
  children: React.ReactElement[];
}

export default function TableListCardGroup({ children, ...restProps }: TableListCardGroupProps & ViewProps) {
  const elements = React.Children.toArray(children);

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  return (
    <View style={styles.outerContainer} {...restProps}>
      {elements.map((element, index) => {
        const position =
          elements.length === 1 ? "alone" : index === 0 ? "first" : index + 1 === elements.length ? "last" : "middle";

        return (
          <React.Fragment key={index}>
            {React.isValidElement(element) ? React.cloneElement(element, { position }) : null}
            {elements.length === index ? null : <View style={separatorStyle} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

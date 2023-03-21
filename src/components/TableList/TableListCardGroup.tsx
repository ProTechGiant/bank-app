import * as React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { shadowStyle } from "./styling";
import { TableListCardProps } from "./TableListCard";

interface TableListCardGroupProps extends ViewProps {
  children: React.ReactElement<TableListCardProps> | null | Array<React.ReactElement<TableListCardProps> | null>;
}

export default function TableListCardGroup({ children, ...restProps }: TableListCardGroupProps) {
  const elements = React.Children.toArray(children) as Array<React.ReactElement<TableListCardProps> | null>;

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderRadius: theme.radii.small,
  }));

  const separatorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.palette["neutralBase-50"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.palette["neutralBase-30"],
    marginLeft: 16,
  }));

  return (
    <View style={[containerStyle, shadowStyle]} {...restProps}>
      {elements.map((element, index) => {
        const position =
          elements.length === 1 ? "alone" : index === 0 ? "first" : index + 1 === elements.length ? "last" : "middle";

        return (
          <React.Fragment key={index}>
            {React.isValidElement(element) ? React.cloneElement(element, { position }) : null}
            {elements.length - 1 === index ? null : (
              <View style={separatorContainerStyle}>
                <View style={separatorStyle} />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

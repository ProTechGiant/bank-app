import * as React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { WithShadow } from "@/components";
import { useThemeStyles } from "@/theme";

import { TableListCardProps } from "./TableListCard";

interface TableListCardGroupProps extends ViewProps {
  children: React.ReactElement<TableListCardProps> | null | Array<React.ReactElement<TableListCardProps> | null>;
}

export default function TableListCardGroup({ children, ...restProps }: TableListCardGroupProps) {
  const elements = React.Children.toArray(children) as Array<React.ReactElement<TableListCardProps> | null>;

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
    <WithShadow backgroundColor="neutralBase-60" borderRadius="small">
      <View {...restProps}>
        {elements.map((element, index) => {
          return (
            <React.Fragment key={index}>
              {React.isValidElement(element) ? React.cloneElement(element, { isGrouped: true }) : null}
              {elements.length - 1 === index ? null : (
                <View style={separatorContainerStyle}>
                  <View style={separatorStyle} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </WithShadow>
  );
}

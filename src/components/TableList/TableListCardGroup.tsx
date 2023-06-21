import * as React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { TableListCardProps } from "./TableListCard";

interface TableListCardGroupProps extends ViewProps {
  background?: "dark" | "light";
  children: React.ReactElement<TableListCardProps> | null | Array<React.ReactElement<TableListCardProps> | null>;
}

export default function TableListCardGroup({ background, children, ...restProps }: TableListCardGroupProps) {
  const elements = React.Children.toArray(children) as Array<React.ReactElement<TableListCardProps> | null>;

  const containerBackgroundStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: background === "dark" ? theme.palette["primaryBase-70-8%"] : theme.palette["neutralBase-60"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: background === "dark" ? theme.palette.primaryBase : theme.palette["neutralBase-30"],
  }));

  return (
    <View style={[containerStyle, background !== undefined && containerBackgroundStyle]} {...restProps}>
      {elements.map((element, index) => {
        return (
          <React.Fragment key={index}>
            {React.isValidElement(element) ? React.cloneElement(element, { isGrouped: true }) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

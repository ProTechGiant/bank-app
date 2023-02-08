import * as React from "react";
import { FieldValues } from "react-hook-form";
import { View, ViewProps, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import { ToggleCardProps } from "./ToggleCard";

interface ToggleCardGroupProps<T extends FieldValues> {
  children: React.ReactElement<ToggleCardProps<T>>[];
}

// eslint-disable-next-line prettier/prettier
export default function ToggleCardGroup<T extends FieldValues>({ children, ...restProps }: ToggleCardGroupProps<T> & ViewProps) {
  const elements = React.Children.toArray(children);

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
  }));

  return (
    <View {...restProps}>
      {elements.map((element, index) => {
        const position =
          elements.length === 1 ? "alone" : index === 0 ? "first" : index + 1 === elements.length ? "last" : "middle";

        return (
          <React.Fragment key={index}>
            {React.cloneElement(element, { position })}
            {elements.length !== index && <View style={separatorStyle} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

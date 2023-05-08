import React, { cloneElement } from "react";
import { ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

import Stack from "../Stack";
import { SegmentedControlItemProps } from "./SegmentedControlItem";

interface SegmentedControlProps<T> {
  children: React.ReactElement<SegmentedControlItemProps<T>>[] | React.ReactElement<SegmentedControlItemProps<T>>;
  onPress: (value: T) => void;
  value: T | undefined;
}

export default function SegmentedControl<T>({ children, onPress, value }: SegmentedControlProps<T>) {
  const elements = React.Children.toArray(children) as React.ReactElement<SegmentedControlItemProps<T>>[];

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderBottomColor: theme.palette["neutralBase-40"],
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: theme.spacing["20p"],
    width: "100%",
  }));

  return (
    <Stack direction="horizontal" style={containerStyle} gap="32p">
      {elements.map(element => {
        return (
          <React.Fragment key={element.key}>
            {cloneElement(element, {
              isActive: element.props.value === value,
              onPress: () => onPress(element.props.value),
            })}
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

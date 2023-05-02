import React, { cloneElement } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { RadioButtonProps } from "./RadioButton";

type RadioButtonInGroupProps<T> = Omit<RadioButtonProps<T>, "isSelected" | "onPress" | "value"> & { value: T };
type RadioButtonInGroupElementType<T> = React.ReactElement<RadioButtonInGroupProps<T>>;

interface RadioButtonGroupProps<T> extends ViewProps {
  children: RadioButtonInGroupElementType<T> | RadioButtonInGroupElementType<T>[];
  onPress: (value: T) => void;
  value: T | undefined;
}

export default function RadioButtonGroup<T>({ children, onPress, value, ...restProps }: RadioButtonGroupProps<T>) {
  type InnerRadioButtonInGroupProps = RadioButtonInGroupProps<T> & Pick<RadioButtonProps<T>, "isSelected" | "onPress">;
  const elements = React.Children.toArray(children) as React.ReactElement<InnerRadioButtonInGroupProps>[];

  return (
    <View {...restProps} style={[styles.container, restProps.style]}>
      {elements.map((element, index) => {
        return (
          <React.Fragment key={index}>
            {cloneElement(element, {
              isSelected: element.props.value === value,
              onPress: () => onPress(element.props.value),
            })}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
});

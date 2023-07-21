import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";

import { useThemeStyles } from "@/theme";
interface RadioProps<T> {
  disabled?: boolean;
  onPress?: (value: T | undefined) => void;
  isSelected?: boolean;
  testID?: string;
  value?: T;
}

export default function Radio<T>({ disabled = false, onPress, isSelected = false, testID, value }: RadioProps<T>) {
  const { selectedColor, disabledColor, defaultColor } = useThemeStyles(theme => ({
    selectedColor: theme.palette["primaryBase-40"],
    disabledColor: theme.palette["neutralBase-40"],
    defaultColor: theme.palette["neutralBase-30"],
  }));

  return (
    <Pressable onPress={() => onPress?.(value)} disabled={disabled} testID={testID}>
      <View style={styles.radioButton}>
        <Svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path
            d="M10 .5C4.48.5 0 4.98 0 10.5s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            fill={isSelected && !disabled ? selectedColor : disabled ? disabledColor : defaultColor}
          />
          {isSelected ? (
            <Path d="M10 15.5a5 5 0 100-10 5 5 0 000 10z" fill={disabled ? disabledColor : selectedColor} />
          ) : null}
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  radioButton: {
    marginRight: 10,
  },
});

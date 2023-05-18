import times from "lodash/times";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

interface PincodeInputProps {
  autoComplete?: TextInputProps["autoComplete"];
  autoFocus?: boolean;
  isEditable?: boolean;
  isError?: boolean;
  onChangeText: (value: string) => void;
  length: number;
  value: string;
}

type PincodeInputRef = React.ForwardedRef<{
  blur: () => void;
  focus: () => void;
}>;

function PincodeInput(
  { autoComplete, autoFocus, isEditable = true, isError = false, onChangeText, length, value }: PincodeInputProps,
  ref: PincodeInputRef
) {
  const textInputRef = useRef<TextInput>(null);

  const handleNumberChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      onChangeText(text);
    }
  };

  useImperativeHandle(ref, () => ({
    blur: () => textInputRef.current?.blur(),
    focus: () => textInputRef.current?.focus(),
  }));

  const handleOnFocus = () => {
    textInputRef.current?.focus();
  };

  const boxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
    borderColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    borderWidth: 2,
    justifyContent: "center",
    height: 60,
    width: 50,
  }));

  const boxErrorStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-30"],
    borderColor: theme.palette.errorBase,
  }));

  const boxActiveStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette.primaryBase,
  }));

  const blinkerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    height: 20,
    width: 2,
  }));

  const dotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    borderRadius: 7 / 2,
    height: 7,
    width: 7,
  }));

  return (
    <>
      <Stack accessibilityRole="button" as={Pressable} direction="horizontal" gap="12p" onPress={() => handleOnFocus()}>
        {times(length).map(index => {
          const isActive = value.length === index;
          const isFilled = value.length > index;

          return (
            <View key={index} style={[boxStyle, isError && boxErrorStyle, isActive && boxActiveStyle]}>
              <TextInput
                ref={textInputRef}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                editable={isEditable}
                blurOnSubmit={false}
                onChangeText={handleNumberChange}
                keyboardType="number-pad"
                maxLength={length}
                style={styles.textInput}
                value={value}
              />
              {isActive ? <View style={blinkerStyle} /> : isFilled ? <View style={dotStyle} /> : <View />}
            </View>
          );
        })}
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    opacity: 0,
    position: "absolute",
  },
});

export default forwardRef(PincodeInput);

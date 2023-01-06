import { times } from "lodash";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

interface PinCodeInputProps {
  inputLength: number;
  value: string;
  onChangeText: (value: string) => void;
  isValid: boolean;
}

interface PinCodeInputRefMethods {
  blur: () => void;
  focus: () => void;
}

function PinCodeInput(
  { inputLength, value, onChangeText, isValid }: PinCodeInputProps,
  ref: React.ForwardedRef<PinCodeInputRefMethods>
) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: theme.spacing.large,
    }),
    []
  );
  const errorBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["errorBase-30"],
      borderColor: theme.palette.errorBase,
      borderWidth: 2,
    }),
    []
  );
  const highlightedBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette.complimentBase,
      borderWidth: 2,
    }),
    []
  );
  const inputBoxStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      height: 60,
      justifyContent: "center",
      marginHorizontal: theme.spacing.small,
      width: 50,
    }),
    []
  );
  const inputDotStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase+30"],
      borderRadius: 8,
      height: 10,
      width: 10,
    }),
    []
  );
  const textInputRef = React.useRef<TextInput>(null);

  const [temp, setTemp] = React.useState(value);

  React.useImperativeHandle(ref, () => ({
    blur: () => textInputRef.current?.blur(),
    focus: () => textInputRef.current?.focus(),
  }));

  const boxPressHandler = () => {
    textInputRef.current?.focus();
  };

  const inputToDotOrDigit = (value: string, i: number) => {
    const emptyInput = " ";
    const input = value[i] || emptyInput;
    const isCurrentInput = i === value.length - 1;
    const isLastInput = i === inputLength - 1;

    if (isCurrentInput && !isLastInput) {
      if (temp === "showDot") {
        return <View style={inputDotStyle} />;
      }
      return <Text>{temp}</Text>;
    } else if (input !== emptyInput) {
      return <View style={inputDotStyle} />;
    } else {
      return <View />;
    }
  };

  React.useEffect(() => {
    setTemp(value.substring(value.length - 1));
    setTimeout(() => {
      setTemp("showDot");
    }, 1000);
  }, [value]);

  return (
    <>
      <Pressable style={container} onPress={boxPressHandler}>
        {times(inputLength, i => (
          <View key={i} style={[inputBoxStyle, i === value.length && highlightedBoxStyle, !isValid && errorBoxStyle]}>
            {inputToDotOrDigit(value, i)}
          </View>
        ))}
      </Pressable>
      <TextInput
        autoFocus
        ref={textInputRef}
        maxLength={inputLength}
        keyboardType="number-pad"
        blurOnSubmit={false}
        value={value}
        style={styles.hiddenInput}
        onChangeText={onChangeText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    left: -200,
    opacity: 0,
    position: "absolute",
    top: -200,
  },
});

export default React.forwardRef<PinCodeInputRefMethods, PinCodeInputProps>(PinCodeInput);

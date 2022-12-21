import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as React from "react";
import { times } from "lodash";
import { palette, radii, spacing } from "@/theme/values";

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
        return <View style={styles.inputDot} />;
      }
      return <Text>{temp}</Text>;
    } else if (input !== emptyInput) {
      return <View style={styles.inputDot} />;
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
      <Pressable style={styles.container} onPress={boxPressHandler}>
        {times(inputLength, i => (
          <View
            key={i}
            style={[styles.inputBox, i === value.length && styles.highlightedBox, !isValid && styles.errorBox]}>
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
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: spacing.large,
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    height: 60,
    width: 50,
    marginHorizontal: spacing.small,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
  },
  hiddenInput: {
    opacity: 0,
    left: -200,
    position: "absolute",
    top: -200,
  },
  highlightedBox: {
    borderWidth: 2,
    borderColor: palette.complimentBase,
  },
  errorBox: {
    borderWidth: 2,
    borderColor: palette.errorBase,
    backgroundColor: palette["errorBase-30"],
  },
  inputDot: {
    backgroundColor: palette["neutralBase+30"],
    height: 10,
    width: 10,
    borderRadius: 8,
  },
});

export default React.forwardRef<PinCodeInputRefMethods, PinCodeInputProps>(PinCodeInput);

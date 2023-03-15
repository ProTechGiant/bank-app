import { times } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface PinInputProps {
  pinLength: number;
  onPress: () => void;
  onSubmit: (pin: string) => void;
  isFocus?: boolean;
  isError?: boolean;
}

export default function PinInput({ pinLength, onPress, onSubmit, isFocus = false, isError = false }: PinInputProps) {
  const [boxDisplay, setBoxDisplay] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setBoxDisplay(currentInput.substring(currentInput.length - 1));
    setTimeout(() => {
      setBoxDisplay("dot");
    }, 600);
  }, [currentInput]);

  useEffect(() => {
    if (isError) {
      setCurrentInput("");
    }
  }, [isError]);

  useEffect(() => {
    isFocus ? textInputRef.current?.focus() : textInputRef.current?.blur();
  }, [isFocus]);

  // blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(showCursor => !showCursor);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const inputToDotOrDigit = (value: string, i: number) => {
    const emptyInput = " ";
    const input = value[i] || emptyInput;
    const isCurrentInput = i === value.length - 1;
    const isLastInput = i === pinLength - 1;

    if (isCurrentInput && !isLastInput) {
      if (boxDisplay === "dot") {
        return <View style={inputDotStyle} />;
      }
      return <Text>{boxDisplay}</Text>;
    } else if (input !== emptyInput) {
      return <View style={inputDotStyle} />;
    } else {
      return <View />;
    }
  };

  const handleOnChangeText = (input: string) => {
    setCurrentInput(input);

    if (pinLength === input.length) {
      onSubmit(input);
    }
  };

  const handleOnPress = () => {
    setCurrentInput("");
    onPress();
  };

  const inputBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.extraSmall,
    height: 60,
    justifyContent: "center",
    marginHorizontal: theme.spacing["12p"] / 2,
    width: 50,
  }));

  const highlightedBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette.primaryBase,
    borderWidth: 2,
  }));

  const inputDotStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
    borderRadius: theme.radii.small,
    height: 10,
    width: 10,
  }));

  const errorBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-30"],
    borderColor: theme.palette.errorBase,
    borderWidth: 2,
  }));

  return (
    <Pressable onPress={handleOnPress}>
      <TextInput
        autoFocus={isFocus}
        ref={textInputRef}
        maxLength={pinLength}
        keyboardType="number-pad"
        blurOnSubmit={false}
        value={currentInput}
        style={styles.hiddenInput}
        onChangeText={handleOnChangeText}
      />
      <View style={styles.pinContainer}>
        {times(pinLength).map(i => (
          <View
            key={i}
            style={[inputBoxStyle, i === currentInput.length && highlightedBoxStyle, isError && errorBoxStyle]}>
            {i === currentInput.length && showCursor && !isError && <Typography.Text>|</Typography.Text>}
            {inputToDotOrDigit(currentInput, i)}
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    left: -200,
    opacity: 0,
    position: "absolute",
    top: -200,
  },
  pinContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});

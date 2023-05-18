import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { StyleSheet, TextInput as RNTextInput, TextStyle, View } from "react-native";

import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface NoteInputProps<T extends FieldValues> {
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showCharacterCount?: boolean;
  maxLength: number;
}

export default function NoteInput<T extends FieldValues>({
  control,
  extra,
  isEditable,
  name,
  placeholder,
  showCharacterCount,
  maxLength,
}: NoteInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [isFocused, setIsFocused] = useState(false);

  const textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
    width: 0,
  }));

  return (
    <View>
      <View style={styles.fieldsContainer}>
        <InputBox
          extraStart={extra}
          extraEnd={showCharacterCount && undefined !== maxLength ? `${field.value.length} / ${maxLength}` : undefined}
          isEditable={isEditable}
          isFocused={isFocused}
          isTouched={fieldState.isTouched}
          center={false}
          multiline>
          <RNTextInput
            textAlignVertical="top"
            placeholder={placeholder}
            onChangeText={value => field.onChange(value)}
            value={field.value}
            maxLength={maxLength}
            onBlur={() => {
              field.onBlur();
              setIsFocused(false);
            }}
            multiline
            numberOfLines={2}
            style={textStyles}
          />
        </InputBox>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldsContainer: {
    flexDirection: "row",
  },
});

import { useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Platform, StyleSheet, TextInput, TextStyle, View } from "react-native";

import MaskedCurrencyInput from "@/components/CurrencyInput";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import InputBox from "./internal/InputBox";

interface CurrencyInputProps<T extends FieldValues> {
  block?: boolean;
  control: Control<T>;
  extra?: React.ComponentProps<typeof InputBox>["extraStart"];
  isEditable?: boolean;
  name: Path<T>;
  placeholder?: string | null | undefined;
  label?: string | null;
}

export default function CurrencyInput<T extends FieldValues>({
  block,
  control,
  extra,
  isEditable,
  label,
  name,
  placeholder,
}: CurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const textInputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleOnBlur = () => {
    field.onBlur();
    setIsFocused(false);
  };

  let textStyles = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+20"],
    flexGrow: 1,
    fontSize: theme.typography.text.sizes.callout,
    fontWeight: theme.typography.text.weights.regular,
    padding: 0,
  }));

  if (Platform.OS === "web") {
    const elementWidth = field.value ? String(field.value).length + 1 : 10;
    const webTextStyles = { width: elementWidth + "ch" };
    textStyles = { ...textStyles, ...webTextStyles };
  }

  const placeholderTextColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <InputBox
      block={block}
      extraStart={extra}
      // need to have an `onPress` handler because the innerContainer prevents TextInput from capturing full width
      onPress={() => textInputRef.current?.focus()}
      isEditable={isEditable}
      isFocused={isFocused}
      fieldState={fieldState}
      label={label}>
      <View style={styles.innerContainer}>
        <MaskedCurrencyInput
          ref={textInputRef}
          editable={isEditable}
          onBlur={handleOnBlur}
          onChange={value => field.onChange(value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder ?? undefined}
          placeholderTextColor={placeholderTextColor}
          style={textStyles}
          value={field.value}
        />
        {!!field.value && (
          <Typography.Text color="neutralBase+20" size="callout" style={styles.currency} weight="regular">
            SAR
          </Typography.Text>
        )}
      </View>
    </InputBox>
  );
}

const styles = StyleSheet.create({
  currency: {
    marginLeft: Platform.OS === "web" ? undefined : 4,
    marginTop: Platform.OS === "web" ? undefined : -StyleSheet.hairlineWidth * 2,
  },
  innerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 0,
  },
});

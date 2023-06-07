import { Control, FieldValues, Path, useController } from "react-hook-form";

import { TextInput as StyledTextInput, TextInputProps as StyledTextInputProps } from "@/components/Input";

export type TextInputProps<T extends FieldValues> = StyledTextInputProps & {
  control: Control<T>;
  name: Path<T>;
};

export default function TextInput<T extends FieldValues>({ control, name, ...restProps }: TextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <StyledTextInput
      {...restProps}
      errorText={fieldState.error?.message}
      onBlur={() => field.onBlur()}
      value={field.value}
      onChangeText={value => field.onChange(value)}
    />
  );
}

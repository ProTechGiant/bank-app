import { Control, FieldValues, Path, useController } from "react-hook-form";

import { MaskedTextInput as BaseInput, MaskedTextInputProps as BaseProps } from "@/components/Input";

export interface MaskedTextInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function MaskedTextInput<T extends FieldValues>({
  control,
  name,
  ...restProps
}: MaskedTextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput
      {...restProps}
      errorText={fieldState.error?.message}
      onBlur={() => field.onBlur()}
      value={field.value}
      onChangeText={value => field.onChange(value)}
    />
  );
}

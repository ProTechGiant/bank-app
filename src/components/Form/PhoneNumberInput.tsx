import { Control, FieldValues, Path, useController } from "react-hook-form";

import { PhoneNumberInput as BaseInput, PhoneNumberInputProps as BaseProps } from "@/components/Input";

interface PhoneNumberInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  name,
  ...restProps
}: PhoneNumberInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput
      {...restProps}
      errorText={fieldState.isTouched ? fieldState.error?.message : undefined}
      onBlur={() => field.onBlur()}
      value={field.value}
      onChangeText={value => field.onChange(value)}
    />
  );
}

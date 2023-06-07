import { Control, FieldValues, Path, useController } from "react-hook-form";

import { DatePickerInput as BaseInput, DatePickerInputProps as BaseProps } from "@/components/Input";

interface DatePickerInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function DatePickerInput<T extends FieldValues>({
  control,
  name,
  ...restProps
}: DatePickerInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput
      {...restProps}
      errorText={fieldState.error !== undefined && fieldState.isTouched ? fieldState.error.message : undefined}
      onBlur={() => field.onBlur()}
      onChange={value => field.onChange(value)}
      value={field.value}
    />
  );
}

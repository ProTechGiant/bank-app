import { Control, FieldValues, Path, useController } from "react-hook-form";

import { DayPickerInput as BaseInput, DayPickerInputProps as BaseProps } from "@/components/Input";

interface DayPickerInputProps<T extends FieldValues> extends Omit<BaseProps, "onBlur" | "onChange" | "value"> {
  control: Control<T>;
  name: Path<T>;
}

export default function DayPickerInput<T extends FieldValues>({ control, name, ...restProps }: DayPickerInputProps<T>) {
  const { field } = useController({ control, name });

  return (
    <BaseInput
      {...restProps}
      onBlur={() => field.onBlur()}
      onChange={value => field.onChange(value)}
      value={field.value}
    />
  );
}

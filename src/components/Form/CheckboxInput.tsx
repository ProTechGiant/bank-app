import { Control, FieldValues, Path, useController } from "react-hook-form";

import { CheckboxInput as BaseInput, CheckboxInputProps as BaseProps } from "@/components/Input";

interface CheckboxInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function CheckboxInput<T extends FieldValues>({ control, name, ...restProps }: CheckboxInputProps<T>) {
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

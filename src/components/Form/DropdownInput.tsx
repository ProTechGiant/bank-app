import { Control, FieldValues, Path, useController } from "react-hook-form";

import { DropdownInput as BaseInput, DropdownInputProps as BaseProps } from "@/components/Input";

interface DropdownInputProps<T extends FieldValues> extends Omit<BaseProps<any>, "onBlur" | "onChange" | "value"> {
  control: Control<T>;
  name: Path<T>;
}

export default function DropdownInput<T extends FieldValues>({ control, name, ...restProps }: DropdownInputProps<T>) {
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

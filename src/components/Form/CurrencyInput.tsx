import { Control, FieldValues, Path, useController } from "react-hook-form";

import { CurrencyInput as BaseInput, CurrencyInputProps as BaseProps } from "@/components/Input";

interface CurrencyInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function CurrencyInput<T extends FieldValues>({ control, name, ...restProps }: CurrencyInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput
      {...restProps}
      errorText={fieldState.isTouched ? fieldState.error?.message : undefined}
      onBlur={() => field.onBlur()}
      onChange={value => field.onChange(value)}
      value={field.value}
    />
  );
}

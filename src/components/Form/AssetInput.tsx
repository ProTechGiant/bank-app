import { Control, FieldValues, Path, useController } from "react-hook-form";

import { DatePickerInput as BaseInput, AssetInputProps as BaseProps } from "@/components/Input";

interface AssetInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
}

export default function AssetInput<T extends FieldValues>({ control, name, ...restProps }: AssetInputProps<T>) {
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

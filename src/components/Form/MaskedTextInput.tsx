import { Control, FieldValues, Path, useController } from "react-hook-form";

import { MaskedTextInput as BaseInput, MaskedTextInputProps as BaseProps } from "@/components/Input";

export interface MaskedTextInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
  enableCrossClear?: boolean;
}

export default function MaskedTextInput<T extends FieldValues>({
  control,
  name,
  ...restProps
}: MaskedTextInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  const handleOnCrossClear = () => {
    field.onChange("");
  };

  return (
    <BaseInput
      {...restProps}
      onCrossClear={restProps.enableCrossClear ? handleOnCrossClear : undefined}
      errorText={fieldState.error?.message}
      onBlur={() => field.onBlur()}
      value={field.value}
      onChangeText={value => field.onChange(value)}
    />
  );
}

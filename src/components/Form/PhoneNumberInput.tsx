import { Control, FieldValues, Path, useController } from "react-hook-form";

import { PhoneNumberInput as BaseInput, PhoneNumberInputProps as BaseProps } from "@/components/Input";
import { convertArabicToEnglishNumber } from "@/utils";

interface PhoneNumberInputProps<T extends FieldValues> extends BaseProps {
  control: Control<T>;
  name: Path<T>;
  onContactPress?: () => void;
}

export default function PhoneNumberInput<T extends FieldValues>({
  control,
  name,
  onContactPress,
  ...restProps
}: PhoneNumberInputProps<T>) {
  const { field, fieldState } = useController({ control, name });

  return (
    <BaseInput
      onContactPress={onContactPress}
      {...restProps}
      errorText={fieldState.isTouched ? fieldState.error?.message : undefined}
      onBlur={() => field.onBlur()}
      value={field.value}
      onChangeText={value => field.onChange(convertArabicToEnglishNumber(value))}
    />
  );
}

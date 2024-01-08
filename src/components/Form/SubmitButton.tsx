import { Control, FieldValues, useFormState } from "react-hook-form";

import Button from "@/components/Button";

interface SubmitButtonProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Button>, "disabled" | "onPress"> {
  allowPristine?: boolean;
  control: Control<T>;
  onSubmit: ((e?: unknown) => void) | (() => Promise<void>);
  isDisabled?: boolean;
}

export default function SubmitButton<T extends FieldValues>({
  allowPristine = false,
  control,
  onSubmit,
  isDisabled = false,
  ...buttonProps
}: SubmitButtonProps<T>) {
  const { isDirty, isSubmitting, isValid } = useFormState({ control });
  const disabled = isSubmitting || !isValid || (!isDirty && !allowPristine) || isDisabled;

  return <Button disabled={disabled} loading={isSubmitting} onPress={onSubmit} {...buttonProps} />;
}

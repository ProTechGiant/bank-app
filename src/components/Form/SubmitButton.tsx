import { Control, FieldValues, useFormState } from "react-hook-form";

import Button from "@/components/Button";

interface SubmitButtonProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Button>, "disabled" | "onPress"> {
  allowPristine?: boolean;
  control: Control<T>;
  onSubmit: (() => void) | (() => Promise<void>);
}

export default function SubmitButton<T extends FieldValues>({
  allowPristine = false,
  control,
  onSubmit,
  ...buttonProps
}: SubmitButtonProps<T>) {
  const { isDirty, isSubmitting, isValid } = useFormState({ control });
  const disabled = isSubmitting || !isValid || (!isDirty && !allowPristine);

  return <Button disabled={disabled} loading={isSubmitting} onPress={onSubmit} {...buttonProps} />;
}

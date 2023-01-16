import { Control, FieldValues, useFormState } from "react-hook-form";

import Button from "@/components/Button";

interface SubmitButtonProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Button>, "disabled" | "onPress"> {
  control: Control<T>;
  onSubmit: (() => void) | (() => Promise<void>);
}

export default function SubmitButton<T extends FieldValues>({
  control,
  onSubmit,
  ...buttonProps
}: SubmitButtonProps<T>) {
  const { isDirty, isSubmitting, isValid } = useFormState({ control });

  return <Button disabled={!isDirty || isSubmitting || !isValid} onPress={onSubmit} {...buttonProps} />;
}

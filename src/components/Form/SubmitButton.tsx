import { Control, FieldValues, useFormState } from "react-hook-form";

import Button from "@/components/Button";

interface SubmitButtonProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Button>, "disabled" | "onPress"> {
  control: Control<T>;
  onSubmit: (() => void) | (() => Promise<void>);
  loadingType?: React.ComponentProps<typeof Button>["type"];
}

export default function SubmitButton<T extends FieldValues>({
  control,
  onSubmit,
  loadingType = "loader",
  type = undefined,
  ...buttonProps
}: SubmitButtonProps<T>) {
  const { isDirty, isSubmitting, isValid } = useFormState({ control });

  return (
    <Button
      disabled={!isDirty || isSubmitting || !isValid}
      type={isSubmitting ? loadingType : type}
      onPress={onSubmit}
      {...buttonProps}
    />
  );
}

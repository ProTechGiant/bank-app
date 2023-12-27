import { Control, FieldValues, Path, useController, useFormState } from "react-hook-form";

import Button from "@/components/Button";

interface SubmitNoteButtonProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Button>, "disabled" | "onPress"> {
  allowPristine?: boolean;
  control: Control<T>;
  name: Path<T>;
  forbiddenWords: string[];
  onSubmit: (() => void) | (() => Promise<void>);
}

export default function SubmitNoteButton<T extends FieldValues>({
  allowPristine = false,
  control,
  name,
  forbiddenWords,
  onSubmit,
  ...buttonProps
}: SubmitNoteButtonProps<T>) {
  const { field } = useController({ control, name });
  const { isDirty, isSubmitting, isValid } = useFormState({ control });
  const disabled = isSubmitting || !isValid || (!isDirty && !allowPristine);
  const normalizedContent = field.value.toLowerCase();
  const forbiddens = forbiddenWords.filter(forbiddenWord => normalizedContent.includes(forbiddenWord));

  return (
    <Button
      testID="InternalTransfers.AddNoteScreen:SubmitNoteButton"
      disabled={disabled || forbiddens.length > 0}
      loading={isSubmitting}
      onPress={onSubmit}
      {...buttonProps}
    />
  );
}

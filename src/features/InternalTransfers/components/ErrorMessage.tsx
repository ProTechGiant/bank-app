import { Control, FieldValues, Path, useController, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ErrorFilledCircleIcon } from "@/assets/icons";
import InlineBanner from "@/components/InlineBanner";

interface ErrorMessageProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  forbiddenWords: string[];
}

export default function ErrorMessage<T extends FieldValues>({ control, name, forbiddenWords }: ErrorMessageProps<T>) {
  const { t } = useTranslation();
  const { field } = useController({ control, name });
  const { isSubmitting, isValid } = useFormState({ control });

  const error = (isSubmitting || !isValid) && field.value.length !== 0;
  const normalizedContent = field.value.toLowerCase();
  const forbidden = forbiddenWords.filter(forbiddenWord => normalizedContent.includes(forbiddenWord));

  const forbiddenList = forbidden.join(", ");
  const forbiddenError = forbidden.length > 0 ? forbiddenList.charAt(0).toUpperCase() + forbiddenList.slice(1) : "";

  return (
    <>
      {error || forbiddenError ? (
        <InlineBanner
          variant="error"
          icon={<ErrorFilledCircleIcon />}
          text={
            forbiddenError && forbidden.length <= 1
              ? t("InternalTransfers.AddNoteScreen.forbiddenWordNotAllowed", { forbiddenWord: forbiddenError })
              : forbiddenError && forbidden.length > 1
              ? t("InternalTransfers.AddNoteScreen.forbiddenWordsNotAllowed", { forbiddenWord: forbiddenError })
              : t("InternalTransfers.AddNoteScreen.noSpecialCharacters")
          }
        />
      ) : null}
    </>
  );
}

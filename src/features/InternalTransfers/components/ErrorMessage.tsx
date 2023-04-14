import { Control, FieldValues, Path, useController, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextStyle, View, ViewStyle } from "react-native";

import { ErrorIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

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
  const forbiddenError =
    forbidden.length > 0
      ? forbiddenList.charAt(0).toUpperCase() + forbiddenList.slice(1) + t("InternalTransfers.AddNoteScreen.and")
      : "";

  const errorContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["errorBase-40"],
    paddingHorizontal: theme.spacing["20p"],
    borderRadius: theme.radii.small,
    height: 56,
    marginBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }));

  const textContainer = useThemeStyles<TextStyle>(theme => ({
    marginLeft: 14,
    marginRight: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <>
      {error || forbidden.length > 0 ? (
        <View style={errorContainer}>
          <ErrorIcon color={iconColor} />
          <Typography.Text color="neutralBase+30" weight="regular" size="caption1" style={textContainer}>
            {forbiddenError + t("InternalTransfers.AddNoteScreen.noSpecialCharacters")}
          </Typography.Text>
        </View>
      ) : null}
    </>
  );
}

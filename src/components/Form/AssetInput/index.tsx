import { useActionSheet } from "@expo/react-native-action-sheet";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import DocumentPicker, { DocumentPickerResponse, types } from "react-native-document-picker";
import { Asset, launchImageLibrary } from "react-native-image-picker";

import { DeleteIcon, UploadIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

interface AssetInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export default function AssetInput<T extends FieldValues>({ control, name }: AssetInputProps<T>) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const { field, fieldState } = useController({ control, name });

  const isError = undefined !== fieldState?.error && fieldState.isTouched;
  const isFileSelected = field.value !== undefined && field.value !== null;

  const handleOnPress = () => {
    showActionSheetWithOptions(
      {
        options: [
          t("AssetInput.buttons.openDocuments"),
          t("AssetInput.buttons.openPhotos"),
          t("AssetInput.buttons.cancel"),
        ],
        cancelButtonIndex: 2,
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          handleOnOpenDocumentPress();
        }

        if (selectedIndex === 1) {
          handleOnOpenPhotosPress();
        }
      }
    );
  };

  const handleOnOpenPhotosPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
      });

      if (Array.isArray(result.assets) && result.assets?.length > 0) {
        field.onChange(result.assets[0]);
        field.onBlur();
      }
    } catch (error) {
      warn("upload-fie", "Could not pick photo: ", JSON.stringify(error));
    }
  };

  const handleOnOpenDocumentPress = async () => {
    try {
      const documentPickerResult = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
        copyTo: "cachesDirectory",
        type: [types.pdf],
      });

      field.onChange(documentPickerResult);
      field.onBlur();
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        warn("upload file", "Could not pick document: ", JSON.stringify(error));
      }
    }
  };

  const handleOnDeletePress = () => {
    field.onChange(null);
    field.onBlur();
  };

  const deleteIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.small,
    padding: theme.spacing["20p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    columnGap: theme.spacing["20p"],
    flexDirection: "row",
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginTop: -theme.spacing["20p"],
  }));

  const file = field.value as Asset | DocumentPickerResponse | undefined;
  const fileName = (file as Asset)?.fileName ?? (file as DocumentPickerResponse)?.name;

  return (
    <>
      <View style={containerStyle}>
        {isFileSelected ? (
          <View style={contentStyle}>
            <Pressable onPress={handleOnPress} style={styles.label}>
              <Typography.Text color="neutralBase+30" numberOfLines={2} size="callout">
                {fileName}
              </Typography.Text>
            </Pressable>
            <Pressable onPress={handleOnDeletePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <DeleteIcon color={deleteIconColor} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleOnPress} style={contentStyle}>
            <UploadIcon />
            <Typography.Text color="neutralBase+30" size="callout">
              {t("AssetInput.label")}
            </Typography.Text>
          </Pressable>
        )}
      </View>
      <View style={helperTextStyle}>
        <Typography.Text color={isError ? "errorBase" : "neutralBase+30"} size="caption1">
          {fieldState.error?.message}
        </Typography.Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
  },
});

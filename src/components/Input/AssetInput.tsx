import { useActionSheet } from "@expo/react-native-action-sheet";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import DocumentPicker, { DocumentPickerResponse, types } from "react-native-document-picker";
import { Asset, launchImageLibrary } from "react-native-image-picker";

import { DeleteIcon, UploadIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

export interface AssetInputProps {
  errorText?: string;
  onBlur?: () => void;
  onChange?: (value: Asset | DocumentPickerResponse | null) => void;
  value?: Asset | DocumentPickerResponse;
}

export function AssetInput({ errorText, onBlur, onChange, value }: AssetInputProps) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const isError = undefined !== errorText;
  const isFileSelected = value !== undefined && value !== null;

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
        onChange?.(result.assets[0]);
        onBlur?.();
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

      onChange?.(documentPickerResult);
      onBlur?.();
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        warn("upload file", "Could not pick document: ", JSON.stringify(error));
      }
    }
  };

  const handleOnDeletePress = () => {
    onChange?.(null);
    onBlur?.();
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

  const file = value as Asset | DocumentPickerResponse | undefined;
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
          {errorText}
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

import { useActionSheet } from "@expo/react-native-action-sheet";
import truncate from "lodash/truncate";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { DocumentPickerResponse } from "react-native-document-picker";
import { Asset, launchCamera, launchImageLibrary } from "react-native-image-picker";

import { DeleteIcon, UploadIcon } from "@/assets/icons";
import { CircularProgressIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

export interface AssetInputProps {
  errorText?: string;
  onBlur?: () => void;
  onChange?: (value: Asset | DocumentPickerResponse | null) => void;
  value?: Asset | DocumentPickerResponse;
  progressPercent?: number;
  handleOnPredefinedPress: () => void;
}

export function PhotoInput({
  errorText,
  onBlur,
  onChange,
  value,
  progressPercent,
  handleOnPredefinedPress,
}: AssetInputProps) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const isError = undefined !== errorText;
  const isFileSelected = value !== undefined && value !== null;

  const handleOnPress = () => {
    showActionSheetWithOptions(
      {
        options: [
          t("GoalGetter.CreateGoalGetter.photoInput.buttons.photoPhoneGalary"),
          t("GoalGetter.CreateGoalGetter.photoInput.buttons.predefinedPhoto"),
          t("GoalGetter.CreateGoalGetter.photoInput.buttons.camera"),
          t("GoalGetter.CreateGoalGetter.photoInput.buttons.cancel"),
        ],
        cancelButtonIndex: 2,
        showSeparators: true,
        containerStyle: {
          backgroundColor: "white",
          justifyContent: "center",
        },
      },
      selectedIndex => {
        if (selectedIndex === 0) {
          handleOnOpenPhotosPress();
        } else if (selectedIndex === 1) {
          handleOnPredefinedPress();
        } else if (selectedIndex === 3) {
          handleOnOpenCameraPress();
        }
      }
    );
  };

  const handleOnOpenPhotosPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
        includeBase64: true,
      });
      if (Array.isArray(result.assets) && result.assets?.length > 0) {
        onChange?.(result.assets[0]);
        onBlur?.();
      }
    } catch (error) {
      warn("upload-fie", "Could not pick photo: ", JSON.stringify(error));
    }
  };

  const handleOnOpenCameraPress = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        includeBase64: true,
      });

      if (Array.isArray(result.assets) && result.assets?.length > 0) {
        onChange?.(result.assets[0]);
        onBlur?.();
      }
    } catch (error) {
      warn("take-photo", "Could not take photo: ", JSON.stringify(error));
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
    height: theme.spacing["24p"],
  }));

  const helperTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginTop: -theme.spacing["20p"],
  }));

  const fileName = (value as Asset)?.fileName ?? (value as DocumentPickerResponse)?.name;
  const truncatedFileName = truncate(fileName || "", { length: 22 });
  const resultFileName = value?.type
    ? truncatedFileName.replace(/\.(jpg|jpeg)$/, "") + `.${value.type}`
    : truncatedFileName;

  return (
    <>
      <View style={containerStyle}>
        {isFileSelected ? (
          <View style={contentStyle}>
            <Pressable onPress={() => (progressPercent ? undefined : handleOnPress())} style={styles.label}>
              <Typography.Text color="neutralBase+30" weight="semiBold" numberOfLines={2} size="callout">
                {progressPercent ? `${progressPercent.toFixed(0)}% complete` : resultFileName}
              </Typography.Text>
            </Pressable>
            {progressPercent ? (
              <CircularProgressIcon percentage={progressPercent} />
            ) : (
              <Pressable onPress={handleOnDeletePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <DeleteIcon color={deleteIconColor} />
              </Pressable>
            )}
          </View>
        ) : (
          <Pressable onPress={handleOnPress} style={contentStyle}>
            <UploadIcon />
            <Typography.Text color="neutralBase+30" size="callout">
              {t("GoalGetter.CreateGoalGetter.photoInput.label")}
            </Typography.Text>
          </Pressable>
        )}
      </View>
      <View style={helperTextStyle}>
        <Typography.Text color={isError ? "errorBase" : "neutralBase+30"} size="footnote">
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

import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { Modal, Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface ChooseDocumentUploadOptionModelProps {
  isVisible: boolean;
  onCancel: () => void;
  onChooseFromLibrary: () => void;
  onTakePhoto: () => void;
}

export default function ChooseDocumentUploadOptionModel({
  isVisible,
  onCancel,
  onChooseFromLibrary,
  onTakePhoto,
}: ChooseDocumentUploadOptionModelProps) {
  const { t } = useTranslation();

  const modalStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.transparent,
  }));

  const selectDocumentTextWrapper = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["20p"],
  }));

  const cancelButtonColor = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const upperContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const borderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-20"],
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
  }));

  const borderRadiusStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.medium,
    overflow: "hidden",
  }));

  return (
    <Modal visible={isVisible} style={modalStyles}>
      <Stack direction="vertical" align="stretch" style={[upperContainerStyle, borderRadiusStyle]}>
        <View style={selectDocumentTextWrapper}>
          <Typography.Text testID="Onboarding.UploadDocumentScreen:selectDocumentText" size="footnote" align="center">
            {t("Onboarding.UploadDocumentScreen.selectDocument")}
          </Typography.Text>
        </View>
        <Pressable style={[buttonStyle, borderStyle]} onPress={onTakePhoto}>
          <Typography.Text
            testID="Onboarding.UploadDocumentScreen:takePhotoText"
            size="title3"
            align="center"
            color="secondary_blueBase-20">
            {t("Onboarding.UploadDocumentScreen.takePhoto")}
          </Typography.Text>
        </Pressable>
        <Pressable style={buttonStyle} onPress={onChooseFromLibrary}>
          <Typography.Text
            testID="Onboarding.UploadDocumentScreen:chooseFromLibraryText"
            size="title3"
            align="center"
            color="secondary_blueBase-20">
            {t("Onboarding.UploadDocumentScreen.chooseFromLibrary")}
          </Typography.Text>
        </Pressable>
      </Stack>
      <Pressable style={[buttonStyle, cancelButtonColor, borderRadiusStyle]} onPress={onCancel}>
        <Typography.Text
          testID="Onboarding.UploadDocumentScreen:cancelText"
          size="title3"
          align="center"
          color="secondary_blueBase-20"
          weight="semiBold">
          {t("Onboarding.UploadDocumentScreen.cancel")}
        </Typography.Text>
      </Pressable>
    </Modal>
  );
}

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { PreviewIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import InfoModal from "@/components/InfoModal";
import { useTheme, useThemeStyles } from "@/theme";

import { UploadIcon } from "../assets/UploadIcon";
import { UploadDocumentStatus } from "../constants";
import UploadDocumentStatusView from "./UploadDocumentStatusView";

interface UploadDocumentCardProps {
  title: string;
  description: string;
  comments: string;
  status: UploadDocumentStatus;
  documentGuid: string;
  onPressUpload: (guid: string) => void;
  onViewDocument: (annotationGuid: string, documentGuid: string) => void;
  isUploaded: boolean;
  annotationGuid: string;
  documentIndex: number;
  isSuccessFullyUploaded: boolean;
}

export default function UploadDocumentCard({
  description,
  status,
  title,
  onPressUpload,
  comments,
  onViewDocument,
  documentGuid,
  isUploaded,
  annotationGuid,
  documentIndex,
  isSuccessFullyUploaded,
}: UploadDocumentCardProps) {
  const appTheme = useTheme();
  const { t } = useTranslation();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);

  const isEyeIconVisible = useMemo(() => {
    return status === UploadDocumentStatus.REJECTED || status === UploadDocumentStatus.APPROVED || isUploaded;
  }, [status, isUploaded]);

  const handleOnToggleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const renderItemStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
    paddingHorizontal: theme.spacing["16p"],
    marginVertical: theme.spacing["8p"],
    borderWidth: 1,
    borderRadius: theme.radii.small,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const renderItemDateStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const leftSideContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    columnGap: theme.spacing["16p"],
  }));

  const commentsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <>
      <Stack as={Pressable} align="stretch" direction="vertical">
        <Stack direction="horizontal" style={renderItemStyle} align="center" justify="space-between">
          <Stack style={leftSideContainerStyle} direction="vertical">
            <UploadDocumentStatusView status={status} isDone={isSuccessFullyUploaded} />
            <Typography.Text style={renderItemDateStyle} color="neutralBase+30" size="callout" weight="medium">
              {title
                ? title
                : t("Onboarding.HighRiskRequireDocumentScreen.dummyDocumentTitle", { index: documentIndex })}
            </Typography.Text>
            {description ? (
              <Pressable onPress={handleOnToggleInfoModal}>
                <Typography.Text style={styles.decription} weight="medium" color="primaryBase" size="footnote">
                  {t("Onboarding.HighRiskRequireDocumentScreen.description")}
                </Typography.Text>
              </Pressable>
            ) : null}
            {comments ? (
              <Typography.Text color="errorBase" size="caption1" style={commentsStyle}>
                {comments}
              </Typography.Text>
            ) : null}
          </Stack>
          <Stack direction="horizontal">
            {isEyeIconVisible ? (
              <Pressable onPress={() => onViewDocument(annotationGuid)} style={{ marginRight: 10 }}>
                <PreviewIcon color={appTheme.theme.palette.complimentBase} />
              </Pressable>
            ) : null}
            <Pressable onPress={() => onPressUpload(documentGuid)}>
              <UploadIcon color={isEyeIconVisible ? appTheme.theme.palette.complimentBase : "#B3B3B3"} />
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={handleOnToggleInfoModal}
        title={t("Onboarding.UploadDocumentCardList.InfoModal.title")}
        description={description ? description : t("Onboarding.UploadDocumentCardList.InfoModal.noDescriptionFound")}
        buttonText={t("Onboarding.UploadDocumentCardList.InfoModal.buttonTitle")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  decription: {
    textDecorationLine: "underline",
  },
});

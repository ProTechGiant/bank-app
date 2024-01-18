import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { launchCamera } from "react-native-image-picker";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import FullScreenLoader from "@/components/FullScreenLoader";
import InfoModal from "@/components/InfoModal";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import ChooseDocumentUploadOptionModel from "../components/ChooseDocumentUploadOptionModel";
import UploadDocumentCardList from "../components/UploadDocumentCardList";
import { HighRiskCaseStatus } from "../constants";
import {
  useCheckHighRiskStatus,
  useRetriveHighRiskDocumentListByCustomerId,
  useUploadDocumentHighRisk,
  useVerifyDocumentHighRisk,
} from "../hooks/query-hooks";
import { OnboardingStackParamsNavigationProp } from "../OnboardingStack";
import { UploadDocumentHighRiskRequestInterface } from "../types";
import { convertFileToBase64 } from "../utils/convert-file-to-base64";
import { getHighRiskCaseStatusScreen } from "../utils/get-high-risk-case-status-screen";

const allowedExtensions = ["pdf", "jpg", "png"];
const maxSize = 5 * 1024 * 1024; // 5MB in bytes

export default function UploadDocumentScreen() {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const [isChecked, setIsChecked] = useState(false);
  const [isDocumentSelect, setIsDocumentSelect] = useState(false);
  const [uploadedDocumentsGuidz, setUploadedDocumentsGuidz] = useState<string[]>([]);
  const [successfullyUploadedAnnotationGuidz, setSuccessfullyUploadedAnnotationGuidz] = useState<string[]>([]);
  const { data, isLoading: isReceivingHighRiskDocuments, isError } = useRetriveHighRiskDocumentListByCustomerId();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const {
    mutateAsync: uploadDocumentMutateAsync,
    isError: uploadDocumentError,
    isLoading: isDocumentUploading,
  } = useUploadDocumentHighRisk();
  const {
    mutateAsync: verifyDocumentMutateAsync,
    isError: verifyDocumentError,
    isLoading: isVerifyingDocuments,
  } = useVerifyDocumentHighRisk();
  const [isErrorModelVisible, setIsErrorModelVisible] = useState<boolean>(isError);
  const [selectedDocumentGuid, setSelectedDocumentGuid] = useState("");
  const navigation = useNavigation<OnboardingStackParamsNavigationProp>();
  const [filesBase64, setFilesBase64] = useState<
    { content: string; name: string; type: string; documentGuid: string }[]
  >([]);
  const {
    data: highRiskStatus,
    isLoading: isChekHighRiskStatusLoading,
    refetch: refetchHighRiskDocumentStatus,
  } = useCheckHighRiskStatus();

  useEffect(() => {
    if (!highRiskStatus?.CaseStatus) return;
    if (
      highRiskStatus?.CaseStatus === HighRiskCaseStatus.DOCUMENTS_REQUIRED ||
      highRiskStatus?.CaseStatus === HighRiskCaseStatus.NEW ||
      highRiskStatus?.CaseStatus === HighRiskCaseStatus.DOCUMENTS_RETURNED
    )
      return;
    navigation.navigate(getHighRiskCaseStatusScreen(highRiskStatus.CaseStatus));
  }, [navigation, highRiskStatus]);

  useEffect(() => {
    setIsErrorModelVisible(isError || uploadDocumentError || verifyDocumentError);
  }, [isError, uploadDocumentError, verifyDocumentError]);

  const handleOnPressUpload = (guid: string) => {
    setSelectedDocumentGuid(guid);
    handleOnSelectDocument();
  };

  const handleOnToggleInfoModal = () => {
    setIsInfoModalVisible(!isInfoModalVisible);
  };

  const handleOnTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      includeBase64: true,
    });

    if (result.assets?.length) {
      const { fileName, base64, type } = result.assets[0];

      if (fileName && base64 && type) {
        handleOnUploadDocument(fileName, base64, type);
      }
    } else {
      warn("No photo selected.", "");
    }

    handleOnSelectDocument();
  };

  const handleOnChooseFromLibrary = async () => {
    try {
      const result = await DocumentPicker.pickSingle();
      if (result && result?.uri && result?.name && result?.type && result?.size) {
        const lengthOfNameSplit = result.name.split(".").length;
        if (lengthOfNameSplit === 1) return;
        const fileExtension = result.name.split(".")[lengthOfNameSplit - 1].toLowerCase();
        if (!allowedExtensions.includes(fileExtension) || result.size > maxSize) {
          Alert.alert(
            t("Onboarding.UploadDocumentScreen.fileErrorTitle"),
            t("Onboarding.UploadDocumentScreen.fileErrorMessage"),
            [
              {
                style: "cancel",
              },
            ]
          );
          return;
        }

        const base64 = await convertFileToBase64(result.uri);
        handleOnUploadDocument(result.name, base64, result.type);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        warn("Could not pick document: ", JSON.stringify(error));
      }
    } finally {
      handleOnSelectDocument();
    }
  };

  const handleOnSelectDocument = () => {
    setIsDocumentSelect(!isDocumentSelect);
  };

  const onViewDocument = (annotationGuid: string, documentGuid: string) => {
    const file = filesBase64.find(f => f.documentGuid === documentGuid)!;
    navigation.navigate("Onboarding.PreviewDocumentScreen", {
      base64File: { content: file?.content, name: file?.name, type: file?.name },
      caseAnnotationId: annotationGuid,
    });
  };

  const handleOnCloseErrorModel = () => {
    setIsErrorModelVisible(false);
    if (isError) {
      navigation.goBack();
    }
  };

  const handleOnUploadDocument = async (name: string, base64: string, type: string) => {
    try {
      const document = data?.RequiredDocuments.find(d => d.DocumentGuid === selectedDocumentGuid);

      if (!document || !base64) return;

      const input: UploadDocumentHighRiskRequestInterface = {
        DocumentBodyBase64String: base64,
        DocumentGuid: document.DocumentGuid,
        AnnotationGuid: document.AnnotationGuid,
        DocumentName: name,
        DocumentType: type,
      };
      setFilesBase64(v => [...v, { name, content: base64, type, documentGuid: document.DocumentGuid }]);
      setUploadedDocumentsGuidz(pre => [...pre, selectedDocumentGuid]);
      const result = await uploadDocumentMutateAsync(input);
      setSuccessfullyUploadedAnnotationGuidz(pre => [...pre, result.AnnotationId]);
    } catch (error) {
      warn("Upload document Error", JSON.stringify(error));
    }
  };

  const handleOnVerifyDocument = async () => {
    try {
      await verifyDocumentMutateAsync();
      await refetchHighRiskDocumentStatus();
      navigation.navigate("Onboarding.VerifyingInformationScreen");
    } catch (err) {
      setIsErrorModelVisible(true);
    }
  };

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingRight: theme.spacing["32p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["16p"],
    bottom: 0,
    position: "absolute",
    width: "110%",
    alignSelf: "center",
    paddingHorizontal: theme.spacing["24p"],
    paddingBottom: theme.spacing["4p"],
    paddingTop: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  if (isReceivingHighRiskDocuments || isDocumentUploading || isVerifyingDocuments || isChekHighRiskStatusLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Page>
      <NavHeader />
      <ContentContainer>
        <Typography.Text
          testID="Onboarding.UploadDocumentScreen:title"
          style={headingStyle}
          size="title1"
          weight="medium">
          {t("Onboarding.UploadDocumentScreen.title")}
        </Typography.Text>
        <Typography.Text testID="Onboarding.UploadDocumentScreen:SubTitle" size="callout" color="neutralBase+10">
          {t("Onboarding.UploadDocumentScreen.subTitle")}
          <Pressable onPress={handleOnToggleInfoModal}>
            <InfoCircleIcon />
          </Pressable>
        </Typography.Text>
        <View style={{ height: screenHeight * 0.55 }}>
          <UploadDocumentCardList
            uploadedDocumentsGuidz={uploadedDocumentsGuidz}
            onViewDocument={onViewDocument}
            onPressUpload={handleOnPressUpload}
            documents={data?.RequiredDocuments ?? []}
            successfullyUploadedAnnotationGuidz={successfullyUploadedAnnotationGuidz}
          />
        </View>
        <Stack direction="vertical" style={buttonContainerStyle} align="stretch">
          <Accordion title={t("Onboarding.UploadDocumentScreen.havingTrouble")}>
            <Typography.Text size="footnote" color="neutralBase+10">
              {t("Onboarding.UploadDocumentScreen.suggestion")}
              <Typography.Text size="footnote" color="primaryBase" style={styles.pleaseContactText}>
                {t("Onboarding.UploadDocumentScreen.contactService")}
              </Typography.Text>
            </Typography.Text>
          </Accordion>
          <View style={checkBoxContainerStyle}>
            <CheckboxInput
              value={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              label="I confirm that my documents are accurate and completed"
            />
          </View>
          <Button disabled={!isChecked} onPress={handleOnVerifyDocument}>
            {t("Onboarding.UploadDocumentScreen.buttonText")}
          </Button>
        </Stack>
        <ChooseDocumentUploadOptionModel
          isVisible={isDocumentSelect}
          onCancel={handleOnSelectDocument}
          onChooseFromLibrary={handleOnChooseFromLibrary}
          onTakePhoto={handleOnTakePhoto}
        />
        <NotificationModal
          message={t("Onboarding.FastOnboardingScreen.tryAgain")}
          isVisible={isErrorModelVisible}
          onClose={handleOnCloseErrorModel}
          title={t("Onboarding.FastOnboardingScreen.errorMessage")}
          variant="error"
        />
        <InfoModal
          isVisible={isInfoModalVisible}
          onClose={handleOnToggleInfoModal}
          title={t("Onboarding.UploadDocumentScreen.InfoModal.title")}
          description={t("Onboarding.UploadDocumentScreen.InfoModal.description")}
        />
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  pleaseContactText: {
    textDecorationLine: "underline",
  },
});

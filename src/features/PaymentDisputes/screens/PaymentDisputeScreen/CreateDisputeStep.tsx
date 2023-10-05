import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { DocumentPickerResponse } from "react-native-document-picker";
import { Asset } from "react-native-image-picker";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import AssetInput from "@/components/Form/AssetInput";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { AssetInput as AssetPicker } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { Card, CardStatus } from "@/features/CardActions/types";
import { TransactionDetailed } from "@/features/ViewTransactions/types";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import delayTransition from "@/utils/delay-transition";

import { useCaseUpload, useCreateCase } from "../../hooks/query-hooks";
import { CaseType, CreateDisputeInput, TransactionType } from "../../types";
import { formatDateTime } from "../../utils";

interface CreateDisputeStepProps {
  caseType: CaseType;
  cardId: string;
  cardType: Card["CardType"];
  cardStatus: CardStatus;
  isCardFrozen: boolean;
  reasonCode: string | undefined;
  transactionType: TransactionType;
  transactionDetails: TransactionDetailed;
  onBack: () => void;
  createDisputeUserId: string; // TODO: To be removed once we can use the same ID for freeze card and create case
}
export default function CreateDisputeStep({
  caseType,
  cardId,
  cardType,
  cardStatus,
  isCardFrozen,
  reasonCode,
  transactionType,
  transactionDetails,
  onBack,
  createDisputeUserId,
}: CreateDisputeStepProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const createCase = useCreateCase();

  const { startUpload } = useCaseUpload({
    onProgress: ({ event }) => setPercentage((event.loaded / event.total) * 100),
    onDone: () => setPercentage(undefined),
    onError: () => setPercentage(undefined),
  });

  const transactionDateTime = useMemo(() => {
    const [year, month, day, hours, minutes] = transactionDetails.transactionDate;
    return new Date(new Date(year, month - 1, day, hours ?? 0, minutes ?? 0));
  }, [transactionDetails]);

  const [isCancelDisputeModalVisible, setIsCancelDisputeModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [fileData, setFileData] = useState<Asset | DocumentPickerResponse | undefined>(undefined);
  const [filePickerError, setFilePickerError] = useState<string>("");
  const [percentage, setPercentage] = useState<number | undefined>(undefined);
  const [documentID, setDocumentID] = useState<string | undefined>(undefined);

  const isMessageRequired =
    (caseType === "dispute" && reasonCode === IS_SOMETHING_ELSE_CODE[transactionType]) || caseType === "fraud";

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        DeclarationFlag: yup.boolean().isTrue(),
        CaseDetails: isMessageRequired
          ? yup
              .string()
              .trim()
              .required(t("PaymentDisputes.CreateDisputeModal.messageBox.validation.minLength"))
              .min(25, t("PaymentDisputes.CreateDisputeModal.messageBox.validation.minLength"))
          : yup.string(),
        File:
          caseType === "dispute"
            ? yup
                .mixed()
                .test(
                  "fileSize",
                  t("PaymentDisputes.CreateDisputeModal.file.fileTooBig", { maxFileSize: MAX_FILE_SIZE_MB }),
                  value =>
                    value === undefined ||
                    value === null ||
                    (value?.fileSize && value.fileSize <= fileSizeInBytes) ||
                    (value?.size && value.size <= fileSizeInBytes)
                )
            : yup.string(),
      }),
    [caseType, t, isMessageRequired]
  );

  const { control, handleSubmit } = useForm<CreateDisputeInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      CaseDetails: undefined,
      DeclarationFlag: false,
      File: undefined,
    },
  });

  const handleOnSubmit = async (values: CreateDisputeInput) => {
    try {
      const { File, ...restValues } = values;

      const response = await createCase.mutateAsync({
        createDisputeUserId,
        isCardFrozen,
        reasonCode,
        DocumentId: documentID,
        values: restValues,
      });

      navigation.navigate("PaymentDisputes.DisputeSubmittedScreen", {
        caseType: caseType,
        cardType: cardType,
        cardStatus: cardStatus,
        caseId: response.CaseNumber,
      });
    } catch (error) {
      setIsErrorModalVisible(true);
      warn("payment-disputes", "Could not create dispute / fraud case: ", JSON.stringify(error));
    }
  };

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("PaymentDisputes.TermsAndConditionsModal");
  };

  const handleOnClosePress = () => {
    setIsCancelDisputeModalVisible(true);
  };

  const handleOnConfirmExitDispute = () => {
    setIsCancelDisputeModalVisible(false);

    delayTransition(() => {
      navigation.navigate("ViewTransactions.ViewTransactionsStack", {
        screen: "ViewTransactions.TransactionsScreen",
        params: {
          cardId,
          createDisputeUserId,
        },
      });
    });
  };

  const handleOnCloseConfirmCancelDispute = () => {
    setIsCancelDisputeModalVisible(false);
  };

  const handleOnCloseErrorModal = () => {
    setIsErrorModalVisible(false);
  };

  const handleAssetUpload = async (fileObj: { uri: string; name: string; type: string }) => {
    try {
      setFilePickerError("");
      // Sending uri to the API
      const uploadResponse = await startUpload({
        uri: fileObj.uri,
        name: fileObj.name,
        type: fileObj.type === "pdf" ? "application/pdf" : "image/jpg",
      });
      const parsedResponse = JSON.parse(uploadResponse.responseBody);

      if (parsedResponse.DocumentId) {
        setDocumentID(parsedResponse.DocumentId);
      } else {
        setDocumentID(undefined);
        throw Error;
      }
    } catch (error) {
      setDocumentID(undefined);
      setFilePickerError(t("PaymentDisputes.CreateDisputeModal.file.uploadFailed"));
    }
  };

  const handleAssetPicker = (
    data: {
      type: string;
      size: number;
      fileSize: number;
      name: string;
      uri: string;
      fileName: string;
    } | null
  ) => {
    if (!data) {
      setFilePickerError("");
      setFileData(undefined);
      setPercentage(undefined);
      setDocumentID(undefined);
      return;
    }
    try {
      const assetInfo = {
        size: 0,
        name: "",
        type: "",
        uri: "",
      };
      const assetType = data.type?.includes("pdf")
        ? "pdf"
        : data.type?.includes("jpg") || data.type?.includes("jpeg")
        ? "jpg"
        : undefined;

      if (!assetType) {
        setFilePickerError(t("PaymentDisputes.CreateDisputeModal.file.wrongFile"));
        return;
      }

      assetInfo.size = data[assetType === "pdf" ? "size" : "fileSize"] / 1024 ** 2;
      assetInfo.type = assetType;
      assetInfo.uri = data.uri;
      assetInfo.name = data[assetType === "pdf" ? "name" : "fileName"];

      if (assetInfo.size > MAX_FILE_SIZE_MB) {
        setFilePickerError(t("PaymentDisputes.CreateDisputeModal.file.fileTooBig", { maxFileSize: MAX_FILE_SIZE_MB }));
        return;
      } else {
        // Happy case
        handleAssetUpload(assetInfo);
        setFileData(assetInfo);
      }
    } catch (error) {
      setFilePickerError(t("PaymentDisputes.CreateDisputeModal.file.uploadFailed"));
    }
  };

  const transactionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    borderWidth: 1,
    padding: theme.spacing["16p"],
  }));

  const transactionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    marginHorizontal: -theme.spacing["16p"],
  }));

  const transactionDividerMarginStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const bottomDividerMarginStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const checkBoxStackStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-start",
    marginHorizontal: theme.spacing["12p"],
    paddingBottom: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
    marginTop: -theme.spacing["8p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginStart: -theme.spacing["12p"],
  }));

  const checkBoxTextStyle = useThemeStyles<ViewStyle>(() => ({
    alignItems: "center",
  }));

  return (
    <>
      <NavHeader withBackButton onBackPress={onBack} end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
          <Typography.Text size="title1" weight="medium">
            {t("PaymentDisputes.CreateDisputeModal.title")}
          </Typography.Text>
          <View style={transactionContainerStyle}>
            <View style={transactionHeaderStyle}>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {transactionDetails.title}
              </Typography.Text>
            </View>
            <Typography.Text color="neutralBase+10" size="footnote">
              {formatDateTime(transactionDateTime)}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" size="footnote">
              {transactionDetails.location}
            </Typography.Text>
            <View style={[dividerStyle, transactionDividerMarginStyle]}>
              <Divider color="neutralBase-30" />
            </View>
            <View style={styles.totalContainer}>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("PaymentDisputes.CreateDisputeModal.total")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {parseFloat(transactionDetails.amount).toFixed(2)} SAR
              </Typography.Text>
            </View>
          </View>
          <Stack direction="vertical" gap="24p" align="stretch">
            <TextInput
              control={control}
              label={t("PaymentDisputes.CreateDisputeModal.messageBox.label")}
              name="CaseDetails"
              extra={
                isMessageRequired
                  ? t("PaymentDisputes.CreateDisputeModal.messageBox.required")
                  : t("PaymentDisputes.CreateDisputeModal.messageBox.optional")
              }
              maxLength={300}
              showCharacterCount
              multiline
              numberOfLines={4}
            />
            {caseType === "dispute" ? <AssetInput control={control} name="File" /> : null}
          </Stack>
          <AssetPicker
            progressPercent={percentage}
            errorText={filePickerError}
            value={fileData}
            onChange={handleAssetPicker}
          />
        </Stack>
        <View>
          <View style={[dividerStyle, bottomDividerMarginStyle]}>
            <Divider color="neutralBase-30" />
          </View>
          <Stack direction="horizontal" gap="8p" style={checkBoxStackStyle}>
            <View style={checkBoxContainerStyle}>
              <CheckboxInput control={control} name="DeclarationFlag" />
            </View>
            <View style={checkBoxTextStyle}>
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {t("PaymentDisputes.CreateDisputeModal.checkBoxMessage")}
                <Typography.Text
                  size="footnote"
                  weight="medium"
                  color="primaryBase-40"
                  onPress={handleOnTermsAndConditionsPress}>
                  {t("PaymentDisputes.CreateDisputeModal.termsAndConditions")}
                </Typography.Text>
              </Typography.Text>
            </View>
          </Stack>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {caseType === "fraud"
              ? t("PaymentDisputes.CreateDisputeModal.reportFraudButton")
              : t("PaymentDisputes.CreateDisputeModal.submitDisputeButton")}
          </SubmitButton>
        </View>
      </ContentContainer>
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmExitDispute}>{t("PaymentDisputes.CancelDisputeModal.exitButton")}</Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseConfirmCancelDispute}>
              {caseType === "fraud"
                ? t("PaymentDisputes.CancelDisputeModal.continueReportButton")
                : t("PaymentDisputes.CancelDisputeModal.continueDisputeButton")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.CancelDisputeModal.message")}
        title={t("PaymentDisputes.CancelDisputeModal.title")}
        isVisible={isCancelDisputeModalVisible}
      />
      <NotificationModal
        variant="error"
        buttons={{
          primary: (
            <Button onPress={handleOnCloseErrorModal}>
              {t("PaymentDisputes.CreateDisputeModal.ErrorModal.primaryButtonText")}
            </Button>
          ),
        }}
        message={t("PaymentDisputes.CreateDisputeModal.ErrorModal.message")}
        title={t("PaymentDisputes.CreateDisputeModal.ErrorModal.title")}
        isVisible={isErrorModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const IS_SOMETHING_ELSE_CODE = {
  ATM: "230",
  CARD: "200",
};
const MAX_FILE_SIZE_MB = 5; // TODO: TBC
const fileSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

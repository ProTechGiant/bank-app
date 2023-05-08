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
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { Card } from "@/features/CardActions/types";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { mockTransactionDetails } from "../../mocks/mockTransactionDetails";
import { CaseType } from "../../types";
import { formattedDateTime } from "../../utils";

interface CreateDisputeStepProps {
  caseType: CaseType;
  cardType: Card["CardType"];
  reasonCode: string;
  onBack: () => void;
}

interface CreateDisputeInput {
  DeclarationFlag: boolean;
  Description: string;
  File: (Asset & DocumentPickerResponse) | undefined;
}

export default function CreateDisputeStep({ caseType, cardType, reasonCode, onBack }: CreateDisputeStepProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isCancelDisputeModalVisible, setIsCancelDisputeModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const isMessageRequired = (caseType === "dispute" && reasonCode === IS_SOMETHING_ELSE_CODE) || caseType === "fraud";

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        DeclarationFlag: yup.boolean().isTrue(),
        Description: isMessageRequired
          ? yup
              .string()
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
                    (value?.fileSize && value.fileSize <= fileSizeInBytes) ||
                    (value?.size && value.size <= fileSizeInBytes)
                )
            : yup.string(),
      }),
    [caseType, t, isMessageRequired]
  );

  const { control, handleSubmit } = useForm<CreateDisputeInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Description: undefined,
      DeclarationFlag: false,
      File: undefined,
    },
  });

  const handleOnSubmit = (values: CreateDisputeInput) => {
    console.log(values); // TODO: BE integration
    navigation.navigate("PaymentDisputes.DisputeSubmittedScreen", {
      caseType: caseType,
      cardType: cardType,
      caseId: "123456789", //TODO: hardcoded until BE is available
    });
  };

  const handleOnTermsAndConditionsPress = () => {
    navigation.navigate("PaymentDisputes.TermsAndConditionsModal");
  };

  const handleOnClosePress = () => {
    setIsCancelDisputeModalVisible(true);
  };

  const handleOnConfirmExitDispute = () => {
    setIsCancelDisputeModalVisible(false);
    setTimeout(() => {
      navigation.navigate("Temporary.LandingScreen"); // TODO: navigate to transaction listing page
    }, 300);
  };

  const handleOnCloseConfirmCancelDispute = () => {
    setIsCancelDisputeModalVisible(false);
  };

  const handleOnCloseErrorModal = () => {
    setIsErrorModalVisible(false);
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
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: theme.spacing["12p"],
    paddingBottom: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["16p"],
    marginTop: -theme.spacing["8p"],
  }));

  const checkBoxTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingLeft: theme.spacing["12p"],
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
                {mockTransactionDetails.merchant}
              </Typography.Text>
            </View>
            <Typography.Text color="neutralBase+10" size="footnote">
              {formattedDateTime(mockTransactionDetails.dateTime)}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" size="footnote">
              {mockTransactionDetails.location}
            </Typography.Text>
            <View style={[dividerStyle, transactionDividerMarginStyle]}>
              <Divider color="neutralBase-30" />
            </View>
            <View style={styles.totalContainer}>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {t("PaymentDisputes.CreateDisputeModal.total")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                {mockTransactionDetails.amount} SAR
              </Typography.Text>
            </View>
          </View>
          <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
            <TextInput
              control={control}
              label={t("PaymentDisputes.CreateDisputeModal.messageBox.label")}
              name="Description"
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
        </Stack>
        <View>
          <View style={[dividerStyle, bottomDividerMarginStyle]}>
            <Divider color="neutralBase-30" />
          </View>
          <Stack direction="horizontal" style={checkBoxStackStyle}>
            <View style={checkBoxContainerStyle}>
              <CheckboxInput
                control={control}
                isEditable={true}
                backgroundColor="neutralBase-60"
                bordered={false}
                name="DeclarationFlag"
              />
            </View>
            <View style={checkBoxTextStyle}>
              <Typography.Text size="footnote" weight="medium" color="neutralBase">
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

const IS_SOMETHING_ELSE_CODE = "200";
const MAX_FILE_SIZE_MB = 5; // TODO: TBC
const fileSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { mockDisputeDetails } from "../mocks/mockDisputeDetails";
import { formattedDateTime } from "../utils";

interface DisputeDetailsForm {
  message: string;
  confirmTermsAndConditions: boolean;
}

export default function DisputeDetailsModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<MainStackParams, "PaymentDisputes.DisputeDetailsModal">>();

  const [isCancelDisputeModalVisible, setIsCancelDisputeModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const isSomethingElse = params.disputeReasonsCode === IS_SOMETHING_ELSE_CODE;

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        confirmTermsAndConditions: yup.boolean().isTrue(),
        message: isSomethingElse
          ? yup
              .string()
              .required(t("PaymentDisputes.DisputeDetailsModal.messageBox.validation.minLength"))
              .min(25, t("PaymentDisputes.DisputeDetailsModal.messageBox.validation.minLength"))
          : yup.string(),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<DisputeDetailsForm>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      message: undefined,
      confirmTermsAndConditions: false,
    },
  });

  const handleOnSubmit = (values: DisputeDetailsForm) => {
    console.log(values); // TODO: BE integration
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
      <SafeAreaProvider>
        <Page backgroundColor="neutralBase-60" insets={["bottom", "left", "right"]}>
          <NavHeader withBackButton end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />} />
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
              <Typography.Text size="title1" weight="medium">
                {t("PaymentDisputes.DisputeDetailsModal.title")}
              </Typography.Text>
              <View style={transactionContainerStyle}>
                <View style={transactionHeaderStyle}>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {mockDisputeDetails.merchant}
                  </Typography.Text>
                </View>
                <Typography.Text color="neutralBase+10" size="footnote">
                  {formattedDateTime(mockDisputeDetails.dateTime)}
                </Typography.Text>
                <Typography.Text color="neutralBase+10" size="footnote">
                  {mockDisputeDetails.location}
                </Typography.Text>
                <View style={[dividerStyle, transactionDividerMarginStyle]}>
                  <Divider color="neutralBase-30" />
                </View>
                <View style={styles.totalContainer}>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {t("PaymentDisputes.DisputeDetailsModal.total")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="callout" weight="medium">
                    {mockDisputeDetails.amount} SAR
                  </Typography.Text>
                </View>
              </View>
              <View>
                <TextInput
                  control={control}
                  label={t("PaymentDisputes.DisputeDetailsModal.messageBox.label")}
                  name="message"
                  extra={
                    isSomethingElse
                      ? t("PaymentDisputes.DisputeDetailsModal.messageBox.required")
                      : t("PaymentDisputes.DisputeDetailsModal.messageBox.optional")
                  }
                  maxLength={300}
                  showCharacterCount
                  multiline
                  numberOfLines={4}
                />
              </View>
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
                    name="confirmTermsAndConditions"
                  />
                </View>
                <View style={checkBoxTextStyle}>
                  <Typography.Text size="footnote" weight="medium" color="neutralBase">
                    {t("PaymentDisputes.DisputeDetailsModal.checkBoxMessage")}
                    <Typography.Text
                      size="footnote"
                      weight="medium"
                      color="primaryBase-40"
                      onPress={handleOnTermsAndConditionsPress}>
                      {t("PaymentDisputes.DisputeDetailsModal.termsAndConditions")}
                    </Typography.Text>
                  </Typography.Text>
                </View>
              </Stack>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("PaymentDisputes.DisputeDetailsModal.button")}
              </SubmitButton>
            </View>
          </ContentContainer>
        </Page>
        <NotificationModal
          variant="warning"
          buttons={{
            primary: (
              <Button onPress={handleOnConfirmExitDispute}>
                {t("PaymentDisputes.CancelDisputeModal.primaryButtonText")}
              </Button>
            ),
            secondary: (
              <Button onPress={handleOnCloseConfirmCancelDispute}>
                {t("PaymentDisputes.CancelDisputeModal.secondaryButtonText")}
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
                {t("PaymentDisputes.DisputeDetailsModal.ErrorModal.primaryButtonText")}
              </Button>
            ),
          }}
          message={t("PaymentDisputes.DisputeDetailsModal.ErrorModal.message")}
          title={t("PaymentDisputes.DisputeDetailsModal.ErrorModal.title")}
          isVisible={isErrorModalVisible}
        />
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const IS_SOMETHING_ELSE_CODE = "109";

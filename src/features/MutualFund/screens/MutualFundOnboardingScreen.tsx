import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, Platform, ScrollView, StatusBar, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { Stack, Typography } from "@/components";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  CREATE_CUSTOMER_OTP_REASON_CODE,
  useCreateCustomerOtp,
  useGetSuitabilityQuestions,
  usePostSuitabilityQuestions,
} from "../hooks/query-hooks";

export default function MutualFundOnboardingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: question, isLoading } = useGetSuitabilityQuestions();
  const { mutateAsync: answerQuestions, isSuccess } = usePostSuitabilityQuestions();
  const [dropdownData, setDropdownData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [validationSchema, setValidationSchema] = useState(yup.object().shape({}));
  const otpFlow = useOtpFlow();
  const { mutateAsync: sendMutualFundOTP } = useCreateCustomerOtp();
  const addToast = useToasts();
  const { userId } = useAuthContext();

  const { control, handleSubmit, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {},
  });

  useEffect(() => {
    if (dropdownData.length > 0) {
      const schemaFields = dropdownData.reduce((acc, item) => {
        acc[`${item.id}`] = yup.string().required();
        return acc;
      }, {});

      const newValidationSchema = yup.object().shape(schemaFields);
      setValidationSchema(newValidationSchema);
    }
  }, [dropdownData]);

  useEffect(() => {
    if (question?.Template?.Questions) {
      const processedData = question.Template.Questions.map(q => ({
        title: I18nManager.isRTL ? q.ArabicTitle : q.EnglishTitle,
        options: q.Options.map(option => {
          return {
            label: I18nManager.isRTL ? option.ArabicLabel : option.EnglishLabel,
            value: option.Value,
          };
        }),
        id: q.Id,
      }));
      setDropdownData(processedData);
    }
  }, [question]);

  const renderDropdownsForPage = () => {
    return (
      <ScrollView style={{ flex: 1 }}>
        {dropdownData.map(item => (
          <View style={{ marginVertical: Platform.OS === "ios" ? 17 : 10 }} key={item.id}>
            <DropdownInput
              isFixedHeight={true}
              control={control}
              name={`${item.id}`}
              label={item.title}
              placeholder={item.title}
              options={item.options}
              buttonLabel={t("Settings.FinancialInformation.selectButton")}
              variant="small"
            />
          </View>
        ))}
      </ScrollView>
    );
  };

  const handleOnSubmit = async () => {
    try {
      const userAnswers = dropdownData.map(item => ({
        Id: item.id,
        Answer: {
          Value: getValues()[`${item.id}`],
        },
      }));

      const payload = {
        ProductCode: "MF_SUBSCRIPTION",
        PostTemplate: {
          ProductCode: "MF_SUBSCRIPTION",
          Id: 1,
          Version: 1,
          Questions: userAnswers,
        },
      };

      const response = await answerQuestions(payload);
      if (!isSuccess) {
        addToast({
          variant: "warning",
          message: response.data.error,
        });
      } else {
        otpFlow.handle({
          action: {
            to: "MutualFund.MutualFundOnboardingScreen",
          },
          otpVerifyMethod: "mutual-fund/otps/validate",
          otpOptionalParams: {
            CustomerId: userId,
            ReasonCode: CREATE_CUSTOMER_OTP_REASON_CODE,
          },
          onOtpRequest: () => {
            return sendMutualFundOTP();
          },
          onFinish: async status => {
            if (status === "success") {
              navigation.navigate("MutualFund.MutualFundSuccessfulOnboarding");
            }
            if (status === "fail") {
              addToast({
                variant: "warning",
                message: t("MutualFund.MutualFundOrderSummaryScreen.subscriptionFailed"),
              });
            }
          },
        });
      }
    } catch (error) {
      warn("Mutual Fund", "error submitting answers", JSON.stringify(error));
    }
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["20p"],
  }));

  return isLoading ? (
    <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />
  ) : (
    <Page
      backgroundColor="neutralBase-60"
      insets={["left", "right", "bottom", "top"]}
      testID="MutualFund.Onboarding:Page">
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <NavHeader
        title={t("MutualFund.Onboarding.suitabilityTitle")}
        testID="MutualFund.Onboarding:NavHeader"
        onBackPress={currentPage > 0 ? () => setCurrentPage(currentPage - 1) : () => navigation.goBack()}>
        <Stack direction="vertical" align="center" gap="12p" testID="MutualFund.Onboarding:Stack">
          <Typography.Text size="title3" weight="medium">
            {t("MutualFund.Onboarding.onboardingTitle")}
          </Typography.Text>
        </Stack>
      </NavHeader>

      <View style={mainContainerStyle}>
        {renderDropdownsForPage()}

        <View style={buttonContainerStyle}>
          <SubmitButton
            onSubmit={handleSubmit(handleOnSubmit)}
            control={control}
            testID="MutualFund.Onboarding-Confirm:SubmitButton">
            {t("MutualFund.Onboarding.confirmButton")}
          </SubmitButton>
        </View>
      </View>
    </Page>
  );
}

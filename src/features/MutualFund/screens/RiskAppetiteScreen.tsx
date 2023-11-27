import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { OTP_BLOCKED_TIME } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useBlockedUserFlow from "@/hooks/use-blocked-user-handler";
import { warn } from "@/logger";
import { useThemeStyles } from "@/theme";

import { TermsAndConditions } from "../components";
import RiskType from "../components/RiskType";
import { CREATE_CUSTOMER_OTP_REASON_CODE, useCreateCustomerOtp } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";
export default function RiskAppetiteScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>("");
  const [selectedRisk, setSelectedRisk] = useState<number | undefined>(1);
  const addToast = useToasts();
  const { mutateAsync: sendMutualFundOTP } = useCreateCustomerOtp();
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.RiskAppetiteScreen">>();
  const otpFlow = useOtpFlow();
  const { userId } = useAuthContext();
  const blockedUserFlow = useBlockedUserFlow();

  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleRiskPress = (id: number) => {
    setSelectedRisk(prevSelectedRisk => (prevSelectedRisk === id ? undefined : id));
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("MutualFund.TermsAndConditions");
  };

  const handleOnConfirmPress = () => {
    //TODO: i will remove this when create api to  create customer is ready
    console.log(`Selected Risk Type: ${selectedRisk}, User Input: ${userInput}`);

    try {
      otpFlow.handle({
        action: {
          to: "MutualFund.RiskAppetiteScreen",
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
        onUserBlocked: () => {
          blockedUserFlow.handle("otp", OTP_BLOCKED_TIME);
        },
      });
    } catch (error) {
      warn("Mutual Fund", "error creating user", JSON.stringify(error));
    }
  };

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    flex: 1,
  }));

  const progressIndictorStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    top: -theme.spacing["16p"],
    width: "80%",
  }));

  const termsAndConditionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
    position: "absolute",
    left: 0,
    right: 0,
    bottom: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["12p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  //TODO: waiting the API
  const mockData = {
    Risks: [
      { Description: "low risk description", Icon: "low risk icon", Id: 2, Name: "LOW" },
      { Description: "medium risk description", Icon: "medium risk icon", Id: 3, Name: "MEDIUM" },
      { Description: "high risk description", Icon: "high risk icon", Id: 4, Name: "HIGH" },
    ],
  };

  return (
    <Page backgroundColor="neutralBase-60" testID="MutualFund.RiskAppetite:Page">
      <NavHeader title="" testID="MutualFund.RiskAppetite:NavHeader">
        <View style={progressIndictorStyle}>
          <ProgressIndicator currentStep={route.params.totalPages + 1} totalStep={route.params.totalPages + 1} />
        </View>
      </NavHeader>
      <View style={headerContainerStyle}>
        <Stack direction="vertical" gap="12p" testID="MutualFund.RiskAppetite:Stack">
          <Typography.Text size="title3" weight="medium">
            {t("MutualFund.RisksAppetiteScreen.title")}
          </Typography.Text>
          <Typography.Text size="title3" weight="medium">
            {t("MutualFund.RisksAppetiteScreen.subTitle")}
          </Typography.Text>
        </Stack>
        <View>
          <RiskType
            selectedRisk={selectedRisk}
            onRiskPress={handleRiskPress}
            data={mockData}
            onUserInputChange={setUserInput}
          />
        </View>
        <View style={termsAndConditionContainerStyle}>
          <TermsAndConditions
            conditionsCaption={t("MutualFund.TermsAndConditions.conditionsCaption")}
            conditionsLink={t("MutualFund.TermsAndConditions.conditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
            onPress={handleOnPressTermsAndConditions}
          />
          <View style={buttonContainerStyle}>
            <Button
              onPress={handleOnConfirmPress}
              disabled={isDisabled}
              testID="MutualFund.FundSuccessfulOnboarding:Button">
              {t("MutualFund.Onboarding.confirmButton")}
            </Button>
          </View>
        </View>
      </View>
    </Page>
  );
}

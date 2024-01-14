import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, ScrollView, ViewStyle } from "react-native";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  MutualFundOrderDetailsTable,
  MutualFundSubscriptionSummaryHeader,
  MutualFundSubscriptionSummaryNavHeader,
  TermsAndConditions,
} from "../components";
import { useMutualFundContext } from "../contexts/MutualFundContext";
import { useCheckProductRisk, useMutualFundSubscribeOTP } from "../hooks/query-hooks";
import { PaymentEnum } from "../types";

export default function MutualFundSubscriptionSummaryScreen() {
  const { productId, selectedPayment, startingAmountValue, monthlyAmountValue, consentKey, selectedDay } =
    useMutualFundContext();

  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();

  const { data: checkProductRiskData } = useCheckProductRisk(productId);
  const { mutateAsync: mutualFundSubscribeOTP } = useMutualFundSubscribeOTP();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("MutualFund.TermsAndConditions");
  };

  const getNumberOfUnits = () => {
    return Math.ceil(Number(startingAmountValue?.replace(/,/g, "")) / checkProductRiskData?.CurrentPrice);
  };

  const checkBalanceAmount = () => {
    return checkProductRiskData?.AccountBalance < checkProductRiskData?.MinimumSubscription;
  };

  const getOrderAmount = () => {
    return Number(startingAmountValue?.replace(/,/g, ""));
  };

  const handleOnConfirmPress = async () => {
    // TODO: add data from context once BE team remove mocked data from api
    try {
      otpFlow.handle({
        action: {
          to: "MutualFund.MutualFundSubscriptionSummaryScreen",
        },
        otpVerifyMethod: "mutual-fund/subscribe/validate",
        otpOptionalParams: {
          SubscribeOrderRequest: {
            PortfolioId: "123",
            OrderAmount: getOrderAmount(),
            ProductId: productId,
            OrderCurrency: "SAR",
            PaymentFlag: 1,
            NumberOfUnits: getNumberOfUnits(),
            PortfolioCode: "we3ff",
            IsCroatiaAccount: 1,
            ConsentKey: consentKey,
            TermsAndConditionsFlag: 1,
          },
          OtpValidateBody: {
            CustomerId: "1000004239",
            ReasonCode: "104",
          },
        },
        onOtpRequest: () => {
          return mutualFundSubscribeOTP({
            PortfolioId: "123",
            OrderAmount: getOrderAmount(),
            ProductId: productId,
            OrderCurrency: "SAR",
            PaymentFlag: 1,
            NumberOfUnits: getNumberOfUnits(),
            PortfolioCode: "we3ff",
            IsCroatiaAccount: 1,
            ConsentKey: consentKey,
            TermsAndConditionsFlag: 1,
          });
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("MutualFund.MutualFundSuccessfulSubscription");
          }
          if (status === "fail") {
            // TODO: handle fail status in next BC for mutual fund
          }
        },
      });
    } catch (error) {
      warn("mutualFundSubscribeOTP=>", ` ${(error as Error).message}`);
    }
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <MutualFundSubscriptionSummaryNavHeader />
      <ScrollView style={{ flex: 1 }}>
        <MutualFundSubscriptionSummaryHeader
          checkProductRiskData={checkProductRiskData}
          startingAmount={startingAmountValue}
        />
        <ContentContainer style={contentContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("MutualFund.SubscriptionSummaryScreen.paymentDetails")}
          </Typography.Text>
          <MutualFundOrderDetailsTable
            hasHeader
            checkProductRiskData={checkProductRiskData}
            startingAmount={startingAmountValue}
            monthlyAmount={monthlyAmountValue}
            selectedPayment={selectedPayment}
            selectedDay={selectedDay}
          />
          {checkBalanceAmount() ? (
            <Alert variant="error" message={t("MutualFund.SubscriptionSummaryScreen.sufficientFunds")} />
          ) : null}
          <TermsAndConditions
            extraConditionsCaption={
              I18nManager.isRTL ? "" : t("MutualFund.SubscriptionSummaryScreen.extraConditionsCaption")
            }
            conditionsCaption={
              selectedPayment === PaymentEnum.Monthly
                ? t("MutualFund.SubscriptionSummaryScreen.monthlyAccept")
                : t("MutualFund.SubscriptionSummaryScreen.oneTimeAccept")
            }
            conditionsLink={I18nManager.isRTL ? "" : t("MutualFund.TermsAndConditions.conditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
            onPress={handleOnPressTermsAndConditions}
          />
        </ContentContainer>
        <ContentContainer>
          <Button disabled={isDisabled || checkBalanceAmount()} onPress={handleOnConfirmPress}>
            {t("MutualFund.SubscriptionSummaryScreen.confirm")}
          </Button>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

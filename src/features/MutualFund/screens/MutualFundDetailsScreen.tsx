import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { CheckboxInput } from "@/components/Input";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  MutualFundDetailsHeader,
  MutualFundDetailsNavHeader,
  MutualFundProductsListView,
  PerformanceChart,
} from "../components";
import { useMutualFundContext } from "../contexts/MutualFundContext";
import { useAssetAllocation, useCheckProductRisk, useRiskContentByConsentKey } from "../hooks/query-hooks";
import { PaymentType, RiskEnum, RiskType } from "../types";

export default function MutualFundDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setMutualFundContextState } = useMutualFundContext();

  const [selectedPayment, setSelectedPayment] = useState<PaymentType>(undefined);
  const [selectedRisk, setSelectedRisk] = useState<RiskType>(RiskEnum.LOW);
  const [startingAmountValue, setStartingAmountValue] = useState<string>("10.00");
  const [monthlyAmountValue, setMonthlyAmountValue] = useState<string>("100.00");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { data: assetAllocationData } = useAssetAllocation(selectedRisk);
  const { data: checkProductRiskData } = useCheckProductRisk(assetAllocationData?.FundId);
  const { data: agreementRiskContent } = useRiskContentByConsentKey(checkProductRiskData?.ConsentKey);

  const handleOnRiskSelect = (value: RiskType) => {
    setSelectedRisk(value);
  };

  const handleOnContinuePress = () => {
    if (checkProductRiskData?.MustUpdate) {
      setIsVisible(true);
    } else {
      setMutualFundContextState({
        productId: assetAllocationData?.FundId,
        startingAmountValue: startingAmountValue,
        monthlyAmountValue: monthlyAmountValue,
        selectedPayment: selectedPayment,
        accountNumber: checkProductRiskData?.AccountNumber,
      });
      navigation.navigate("MutualFund.MutualFundSubscriptionSummaryScreen");
    }
  };

  const handleOnRiskConfirm = () => {
    setMutualFundContextState({
      productId: assetAllocationData?.FundId,
      startingAmountValue: startingAmountValue,
      monthlyAmountValue: monthlyAmountValue,
      selectedPayment: selectedPayment,
      accountNumber: checkProductRiskData?.AccountNumber,
      // TODO: add value from api once BE team remove mocked data
      consentKey: agreementRiskContent,
    });
    navigation.navigate("MutualFund.MutualFundSubscriptionSummaryScreen");
  };

  const checkMinimumSubscription = () => {
    if (checkProductRiskData) {
      return (
        Number(startingAmountValue.replace(/,/g, "")) > checkProductRiskData.MinimumSubscription &&
        Boolean(selectedPayment)
      );
    }
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const warningContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <MutualFundDetailsNavHeader />
      <ScrollView style={{ flex: 1 }}>
        <MutualFundDetailsHeader
          selectedPayment={selectedPayment}
          startingAmountValue={startingAmountValue}
          monthlyAmountValue={monthlyAmountValue}
          onSelectPayment={setSelectedPayment}
          onStartingAmountChange={setStartingAmountValue}
          onMonthlyAmountChange={setMonthlyAmountValue}
          checkProductRiskData={checkProductRiskData}
        />
        <ContentContainer style={contentContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("MutualFund.MutualFundDetailsScreen.mutualFundsDetails")}
          </Typography.Text>
          {assetAllocationData !== undefined ? (
            <PerformanceChart
              investmentAmount={Number(monthlyAmountValue.replace(/,/g, ""))}
              performance={assetAllocationData.Last3YearsPerformance}
            />
          ) : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Stack direction="horizontal" gap="8p" align="center">
              <Typography.Text color="primaryBase" size="footnote" weight="medium">
                {t("MutualFund.MutualFundDetailsScreen.fundRisk")}
              </Typography.Text>
              <Pill isActive={selectedRisk === RiskEnum.LOW} onPress={() => handleOnRiskSelect(RiskEnum.LOW)}>
                {t("MutualFund.MutualFundDetailsScreen.lowRisk")}
              </Pill>
              <Pill isActive={selectedRisk === RiskEnum.MEDIUM} onPress={() => handleOnRiskSelect(RiskEnum.MEDIUM)}>
                {t("MutualFund.MutualFundDetailsScreen.midRisk")}
              </Pill>
              <Pill isActive={selectedRisk === RiskEnum.HIGH} onPress={() => handleOnRiskSelect(RiskEnum.HIGH)}>
                {t("MutualFund.MutualFundDetailsScreen.highRisk")}
              </Pill>
            </Stack>
          </ScrollView>
          <Stack direction="vertical" style={warningContainerStyle}>
            <Typography.Text color="primaryBase" size="footnote">
              {t("MutualFund.MutualFundDetailsScreen.safelyInvesting")}
            </Typography.Text>
          </Stack>
        </ContentContainer>
        <MutualFundProductsListView assetAllocationData={assetAllocationData} />
        <ContentContainer>
          <Button disabled={!checkMinimumSubscription()} onPress={handleOnContinuePress}>
            {t("MutualFund.MutualFundDetailsScreen.continueToDetails")}
          </Button>
        </ContentContainer>
      </ScrollView>

      <NotificationModal
        variant="warning"
        title={t("MutualFund.MutualFundDetailsScreen.dearCustomer")}
        message={t("MutualFund.MutualFundDetailsScreen.classificationRisks", {
          value: checkProductRiskData?.ProductName,
        })}
        isVisible={isVisible}
        buttons={{
          primary: (
            <Button disabled={!isChecked} onPress={handleOnRiskConfirm}>
              {t("MutualFund.MutualFundDetailsScreen.confirmRiskModal")}
            </Button>
          ),
          secondary: (
            <Button onPress={() => setIsVisible(false)}>
              {t("MutualFund.MutualFundDetailsScreen.updateRiskLevel")}
            </Button>
          ),
        }}>
        <Stack direction="horizontal" style={modalContainerStyle}>
          <CheckboxInput onChange={() => setIsChecked(!isChecked)} value={isChecked} />
          {/* TODO: this value should come from api with translation*/}
          <Typography.Text color="neutralBase-10" size="footnote">
            {agreementRiskContent ? agreementRiskContent : null}
          </Typography.Text>
        </Stack>
      </NotificationModal>
    </Page>
  );
}

import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { CheckboxInput } from "@/components/Input";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  MutualFundOrderDetailsTable,
  MutualFundSubscriptionSummaryHeader,
  MutualFundSubscriptionSummaryNavHeader,
  TermsAndConditions,
} from "../components";
import { useCheckProductRisk } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";
import { PaymentEnum } from "../types";

export default function MutualFundSubscriptionSummaryScreen() {
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.MutualFundSubscriptionSummaryScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: checkProductRiskData } = useCheckProductRisk(route.params.productId);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleOnCheckboxPress = () => {
    setIsDisabled(value => !value);
  };

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("MutualFund.TermsAndConditions");
  };

  const handleOnAcceptPress = () => {
    setIsChecked(!isChecked);
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
    paddingBottom: theme.spacing["32p"],
    borderWidth: 1,
    borderColor: "red",
  }));

  const checkBoxContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <MutualFundSubscriptionSummaryNavHeader />
      <ScrollView style={{ flex: 1 }}>
        <MutualFundSubscriptionSummaryHeader
          checkProductRiskData={checkProductRiskData}
          startingAmount={route.params.startingAmountValue}
        />
        <ContentContainer style={contentContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("MutualFund.SubscriptionSummaryScreen.paymentDetails")}
          </Typography.Text>
          <MutualFundOrderDetailsTable
            hasHeader
            checkProductRiskData={checkProductRiskData}
            startingAmount={route.params.startingAmountValue}
            monthlyAmount={route.params.monthlyAmountValue}
            selectedPayment={route.params.selectedPayment}
          />
          {checkProductRiskData?.AccountBalance < checkProductRiskData?.MinimumSubscription ? (
            <Alert variant="error" message={t("MutualFund.SubscriptionSummaryScreen.sufficientFunds")} />
          ) : null}
          <Pressable onPress={handleOnAcceptPress}>
            <Stack direction="horizontal" gap="8p" style={checkBoxContainerStyle}>
              <CheckboxInput onChange={handleOnAcceptPress} value={isChecked} />
              <Typography.Text color="neutralBase-10" size="footnote" style={{ flex: 1 }}>
                {route.params.selectedPayment === PaymentEnum.Monthly
                  ? t("MutualFund.SubscriptionSummaryScreen.monthlyAccept")
                  : t("MutualFund.SubscriptionSummaryScreen.oneTimeAccept")}
              </Typography.Text>
            </Stack>
          </Pressable>
          <TermsAndConditions
            extraConditionsCaption={t("MutualFund.SubscriptionSummaryScreen.extraConditionsCaption")}
            conditionsCaption={t("MutualFund.SubscriptionSummaryScreen.agreeToFund")}
            conditionsLink={t("MutualFund.TermsAndConditions.conditionsLink")}
            onCheckBoxPress={handleOnCheckboxPress}
            isChecked={!isDisabled}
            onPress={handleOnPressTermsAndConditions}
          />
        </ContentContainer>
        <ContentContainer>
          <Button
            disabled={isDisabled || !isChecked}
            onPress={() => {
              // TODO: add navigation
              return;
            }}>
            {t("MutualFund.SubscriptionSummaryScreen.confirm")}
          </Button>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

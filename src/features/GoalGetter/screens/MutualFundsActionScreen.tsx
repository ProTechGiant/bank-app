import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoldWalletImage from "../assets/gold-wallet-image.png";
import { GoalManagementSuccessfulIcon } from "../assets/icons";
import { SavingPotWithDrawContent } from "../components";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import MutualFundModal from "./MutualFundModal";

export default function MutualFundsActionScreen() {
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.SavingPotActionScreen">>();
  const { fromBalanceAmount, toBalanceAmount, goalId } = params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();
  const { mutateAsync: sendGoalGetterOTP } = useGoalGetterOTP();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [isSummaryModal, setIsSummaryModal] = useState<boolean>(false);

  const handleOnContinuePress = async (weight: number) => {
    try {
      setSelectedAmount(weight);
      setIsSummaryModal(true);
    } catch (error) {}
  };

  const handleOnConfirmPress = () => {
    // TODO remove this static data and add integrate with BE
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.MutualFundsActionScreen",
        },
        otpVerifyMethod: "mutual-fund-subscribe",
        otpOptionalParams: {
          PortfolioId: "1",
          goalId,
          OrderAmount: selectedAmount,
          ProductId: 567,
          OrderCurrency: "USD",
          PaymentFlag: 1,
          NumberOfUnits: 10,
          PortfolioCode: "1",
          IsCroatiaAccount: 0,
          ConsentKey: "consent",
          TermsAndConditionsFlag: true,
        },
        onOtpRequest: () => {
          return sendGoalGetterOTP();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
              title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
              subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.addMoneySubLabel"),
              viewTransactions: false,
              icon: <GoalManagementSuccessfulIcon />,
            });
          }
        },
      });
    } catch (error) {
      warn("goal-getter", "error submitting goal attributes", JSON.stringify(error));
    }
  };

  const goldWalletStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    width: "100%",
    alignItems: "center",
    borderRadius: theme.radii.medium,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <ScrollView>
        <NavHeader
          title={t("Home.DashboardScreen.GoalGetter.goalManagement.buy")}
          end={
            <CloseEndButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          }
        />
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        <ContentContainer>
          <Stack direction="vertical" gap="16p">
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.from")}
            </Typography.Text>
            <Stack direction="horizontal" style={goldWalletStyle} gap="24p">
              <Image source={GoldWalletImage} />
              <Stack direction="vertical" gap="4p">
                <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                  {t("Home.DashboardScreen.GoalGetter.actionsSummary.availableBalance")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  {fromBalanceAmount && fromBalanceAmount.toFixed(2).toString().split(".")[0]}
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    .{fromBalanceAmount && fromBalanceAmount.toFixed(2).toString().split(".")[1]}{" "}
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
                  </Typography.Text>
                </Typography.Text>
              </Stack>
            </Stack>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
            <Stack direction="horizontal" style={goldWalletStyle} gap="24p">
              <Image source={GoldWalletImage} />
              <Stack direction="vertical" gap="4p">
                <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                  {t("Home.DashboardScreen.GoalGetter.actionsSummary.alRajhiGrowthFund")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  {toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[0]}
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    .{toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[1]}
                  </Typography.Text>
                </Typography.Text>
              </Stack>
            </Stack>
            <SavingPotWithDrawContent
              handleOnContinuePress={handleOnContinuePress}
              totalBalance={toBalanceAmount}
              savingPot={fromBalanceAmount}
              savingPotType={params.savingPotType}
            />
          </Stack>
        </ContentContainer>
        {isSummaryModal ? (
          <MutualFundModal
            isVisible={isSummaryModal}
            changeVisibility={setIsSummaryModal}
            withdrawAmount={selectedAmount}
            originalBalance={fromBalanceAmount}
            remainingAmount={fromBalanceAmount - toBalanceAmount}
            handleOnConfirmPress={handleOnConfirmPress}
          />
        ) : null}
      </ScrollView>
    </Page>
  );
}

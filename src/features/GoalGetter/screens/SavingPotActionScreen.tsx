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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import GoldWalletImage from "../assets/gold-wallet-image.png";
import { GoalManagementSuccessfulIcon } from "../assets/icons";
import { SavingPotWithDrawContent } from "../components";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { useGoalGetterOTP } from "../hooks/query-hooks";
import { SavingPotsType } from "../utils";
import SavingPotModal from "./SavingPotModal";

export default function SavingPotActionScreen() {
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.SavingPotActionScreen">>();
  const { savingPotType: actionType, fromBalanceAmount, toBalanceAmount, goalId } = params;
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
    try {
      otpFlow.handle({
        action: {
          to: "GoalGetter.SavingPotActionScreen",
        },
        otpVerifyMethod:
          actionType === SavingPotsType.WITHDRAW ? "goal-saving-pot-withdraw" : "goal-saving-pot-add-money",
        otpOptionalParams: {
          PaymentAmount: selectedAmount,
          // TODO neet to check it with back end
          goalId,
          Currency: "SAR",
          Collect: "Y",
          CreditorAccount: "CreditorAccount",
        },
        onOtpRequest: () => {
          return sendGoalGetterOTP();
        },
        onFinish: async status => {
          if (status === "success") {
            navigation.navigate("GoalGetter.GoalManagementSuccessfulScreen", {
              title: SavingPotsType.WITHDRAW
                ? t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label")
                : t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
              subtitle: SavingPotsType.WITHDRAW
                ? t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.addMoneySubLabel")
                : t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.withDrawMoneySubLabel"),
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

  const balanceStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    width: "100%",
    alignItems: "center",
    borderRadius: theme.radii.medium,
    padding: theme.spacing["16p"],
  }));

  const currentAccountCardStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-10"],
    borderRadius: theme.spacing["8p"],
    padding: 8,
    marginHorizontal: -5,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <ScrollView>
        <NavHeader
          title={
            actionType === SavingPotsType.WITHDRAW
              ? t("Home.DashboardScreen.GoalGetter.goalManagement.withdraw")
              : t("Home.DashboardScreen.GoalGetter.goalManagement.addMoney")
          }
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
            {actionType === SavingPotsType.WITHDRAW ? (
              <Stack direction="horizontal" style={goldWalletStyle} gap="24p">
                <Image source={GoldWalletImage} />

                <Stack direction="vertical" gap="4p">
                  <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPot")}
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
            ) : (
              <Stack direction="horizontal" style={balanceStyle} gap="16p">
                <Stack direction="vertical" style={currentAccountCardStyle} gap="8p">
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("GoldWallet.TransactionSummaryModal.currentAccount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.dots")} {"23342334".slice(-4)}
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical" gap="4p">
                  <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.availableBalance")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                    {fromBalanceAmount && fromBalanceAmount.toFixed(2).toString().split(".")[0]}
                    <Typography.Text color="neutralBase+30" size="body" weight="regular">
                      .{fromBalanceAmount && fromBalanceAmount.toFixed(2).toString().split(".")[1]}{" "}
                      {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            )}
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
            {actionType === SavingPotsType.ADDMONEY ? (
              <Stack direction="horizontal" style={goldWalletStyle} gap="24p">
                <Image source={GoldWalletImage} />

                <Stack direction="vertical" gap="4p">
                  <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.savingPot")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                    {toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[0]}
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      .{toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[1]}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            ) : (
              <Stack direction="horizontal" style={balanceStyle} gap="16p">
                <Stack direction="vertical" style={currentAccountCardStyle} gap="8p">
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("GoldWallet.TransactionSummaryModal.currentAccount")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase-60" size="caption2">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.dots")} {"23342334".slice(-4)}
                  </Typography.Text>
                </Stack>
                <Stack direction="vertical" gap="4p">
                  <Typography.Text color="neutralBase-20" size="caption1" weight="medium">
                    {t("Home.DashboardScreen.GoalGetter.actionsSummary.availableBalance")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                    {toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[0]}
                    <Typography.Text color="neutralBase+30" size="body" weight="regular">
                      .{toBalanceAmount && toBalanceAmount.toFixed(2).toString().split(".")[1]}{" "}
                      {t("Home.DashboardScreen.GoalGetter.actionsSummary.SAR")}
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            )}
            <SavingPotWithDrawContent
              handleOnContinuePress={handleOnContinuePress}
              totalBalance={toBalanceAmount}
              savingPot={fromBalanceAmount}
              savingPotType={params.savingPotType}
            />
          </Stack>
        </ContentContainer>

        {isSummaryModal ? (
          <SavingPotModal
            isVisible={isSummaryModal}
            changeVisibility={setIsSummaryModal}
            withdrawAmount={selectedAmount}
            type={actionType}
            originalBalance={fromBalanceAmount}
            remainingAmount={fromBalanceAmount - toBalanceAmount}
            handleOnConfirmPress={handleOnConfirmPress}
          />
        ) : null}
      </ScrollView>
    </Page>
  );
}

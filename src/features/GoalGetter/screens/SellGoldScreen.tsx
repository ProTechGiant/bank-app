import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { DealStatusEnum, MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";
import { MarketStatusEnum } from "@/types/timer";

import GoldWalletImage from "../assets/gold-wallet-image.png";
import { GoalManagementSuccessfulIcon } from "../assets/icons";
import { SellGoldContent } from "../components";
import { useAcceptGoldFinalDeal, useGoalGetterOTP } from "../hooks/query-hooks";
import { GoldFinalDealResponseType } from "../types";
import GoldSummaryModal from "./GoldSummaryModal";

export default function SellGoldScreen() {
  const { t } = useTranslation();
  const [selectedWeight, setSelectedWeight] = useState<number>(0);
  const [isBuyGoldSummaryModal, setIsBuyGoldSummaryModal] = useState<boolean>(false);
  const navigation = useNavigation();
  const handleOnContinuePress = async (weight: number) => {
    try {
      setSelectedWeight(weight);
      setIsBuyGoldSummaryModal(true);
    } catch (error) {}
  };
  const otpFlow = useOtpFlow();
  const { mutateAsync, isLoading: isAcceptingTheDeal } = useAcceptGoldFinalDeal();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const handleOnAcceptDeal = async (finalDealData: GoldFinalDealResponseType) => {
    try {
      await mutateAsync({
        ...finalDealData,
        Status: DealStatusEnum.ACCEPT,
        walletId: "G10007",
        Type: TransactionTypeEnum.SELL,
      });
      otpFlow.handle({
        action: {
          to: "GoalGetter.GoalManagementSuccessfulScreen",
          params: {
            title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.label"),
            subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.sellGoldSubLabel"),

            viewTransactions: true,
            icon: <GoalManagementSuccessfulIcon />,
          },
        },
        otpVerifyMethod: "goals/gold/submit",
        // otpOptionalParams: {
        //   Type: tradeType,
        // },
        onOtpRequest: () => {
          return generateOtp();
        },
      });
    } catch (error) {
      setIsErrorModalVisible(true);
    }
  };

  const handleOnClose = () => {
    setIsErrorModalVisible(false);
    navigation.goBack();
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
    // padding: theme.spacing["16p"],
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
    <ScrollView>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("GoldWallet.TradeGoldScreen.sellTitle")}
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
                  {t("Home.DashboardScreen.GoalGetter.actionsSummary.goldWallet")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="title3" weight="bold">
                  47 Grams
                  <Typography.Text color="neutralBase+30" size="callout" weight="bold">
                    (9,870.00
                  </Typography.Text>
                  <Typography.Text color="neutralBase+30" size="footnote" weight="regular">
                    SAR)
                  </Typography.Text>
                </Typography.Text>
              </Stack>
            </Stack>
            <Typography.Text color="neutralBase+30" size="callout" weight="medium">
              {t("Home.DashboardScreen.GoalGetter.actionsSummary.to")}
            </Typography.Text>
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
                  23,400
                  <Typography.Text color="neutralBase+30" size="body" weight="regular">
                    .00 SAR
                  </Typography.Text>
                </Typography.Text>
              </Stack>
            </Stack>
            <SellGoldContent handleOnContinuePress={handleOnContinuePress} totalBalance={40000} marketPrice={220} />
          </Stack>
        </ContentContainer>

        {isBuyGoldSummaryModal ? (
          <GoldSummaryModal
            isVisible={isBuyGoldSummaryModal}
            changeVisibility={setIsBuyGoldSummaryModal}
            walletId="walletId"
            weight={selectedWeight}
            type={TransactionTypeEnum.SELL}
            measureUnit={MeasureUnitEnum.GM}
            marketStatus={MarketStatusEnum.OPEN}
            isAcceptingTheDeal={isAcceptingTheDeal}
            onAcceptDeal={handleOnAcceptDeal}
          />
        ) : null}
      </Page>
      <NotificationModal
        variant="error"
        title={t("GoldWallet.errorModal.title")}
        message={t("GoldWallet.errorModal.tryAgain")}
        isVisible={isErrorModalVisible}
        onClose={handleOnClose}
      />
    </ScrollView>
  );
}

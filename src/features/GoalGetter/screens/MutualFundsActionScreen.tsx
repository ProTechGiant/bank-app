import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StatusBar, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";
import { MarketStatusEnum } from "@/types/timer";

import GoldWalletImage from "../assets/gold-wallet-image.png";
import { SavingPotWithDrawContent } from "../components";
import { SavingPotsType } from "../utils";
import MutualFundModal from "./MutualFundModal";

export default function MutualFundsActionScreen() {
  //   const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.SavingPotActionScreen">>();
  const actionType = "BUY";
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
    <Page backgroundColor="neutralBase-60">
      <ScrollView>
        <NavHeader
          title={
            actionType === "BUY"
              ? t("Home.DashboardScreen.GoalGetter.goalManagement.buy")
              : t("Home.DashboardScreen.GoalGetter.goalManagement.sell")
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
                  22000
                  <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                    .00 SAR
                  </Typography.Text>
                </Typography.Text>
              </Stack>
            </Stack>

            <SavingPotWithDrawContent
              handleOnContinuePress={handleOnContinuePress}
              totalBalance={20000}
              savingPot={22000}
              savingPotType={SavingPotsType.ADDMONEY}
              isMutualFund={true}
            />
          </Stack>
        </ContentContainer>

        {isBuyGoldSummaryModal ? (
          <MutualFundModal
            isVisible={isBuyGoldSummaryModal}
            changeVisibility={setIsBuyGoldSummaryModal}
            walletId="walletId"
            weight={selectedWeight}
            type={TransactionTypeEnum.BUY}
            measureUnit={MeasureUnitEnum.GM}
            marketStatus={MarketStatusEnum.CLOSED}
            isAcceptingTheDeal={false}
            onAcceptDeal={() => {
              //TODO will handle after integrated with data
            }}
          />
        ) : null}
      </ScrollView>
    </Page>
  );
}

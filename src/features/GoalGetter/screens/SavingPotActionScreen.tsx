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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { MeasureUnitEnum } from "@/types/GoldTransactions";
import { MarketStatusEnum } from "@/types/timer";

import GoldWalletImage from "../assets/gold-wallet-image.png";
import { SavingPotWithDrawContent } from "../components";
import { GoalGetterStackParams } from "../GoalGetterStack";
import { SavingPotsType } from "../utils";
import SavingPotModal from "./SavingPotModal";

export default function SavingPotActionScreen() {
  const { params } = useRoute<RouteProp<GoalGetterStackParams, "GoalGetter.SavingPotActionScreen">>();
  const actionType = params.savingPotType;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [selectedWeight, setSelectedWeight] = useState<number>(0);
  const [isBuyGoldSummaryModal, setIsBuyGoldSummaryModal] = useState<boolean>(false);

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
                    22000
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      .00 SAR
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
                    23,400
                    <Typography.Text color="neutralBase+30" size="body" weight="regular">
                      .00 SAR
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
                    22000
                    <Typography.Text color="neutralBase+30" size="callout" weight="regular">
                      .00 SAR
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
                    23,400
                    <Typography.Text color="neutralBase+30" size="body" weight="regular">
                      .00 SAR
                    </Typography.Text>
                  </Typography.Text>
                </Stack>
              </Stack>
            )}
            {actionType === SavingPotsType.WITHDRAW ? (
              <SavingPotWithDrawContent
                handleOnContinuePress={handleOnContinuePress}
                totalBalance={40000}
                savingPot={22000}
                savingPotType={params.savingPotType}
              />
            ) : (
              <SavingPotWithDrawContent
                handleOnContinuePress={handleOnContinuePress}
                totalBalance={30000}
                savingPot={42000}
                savingPotType={params.savingPotType}
              />
            )}
          </Stack>
        </ContentContainer>

        {isBuyGoldSummaryModal ? (
          <SavingPotModal
            isVisible={isBuyGoldSummaryModal}
            changeVisibility={setIsBuyGoldSummaryModal}
            walletId="walletId"
            weight={selectedWeight}
            type={actionType}
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import { GoldTradeContent } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { DealStatusEnum, MeasureUnitEnum, TransactionTypeEnum } from "@/types/GoldTransactions";
import { MarketStatusEnum } from "@/types/timer";

import { GoalManagementSuccessfulIcon } from "../assets/icons";
import { goldMock } from "../constants";
import { useAcceptGoldFinalDeal, useGoalGetterOTP } from "../hooks/query-hooks";
import { GoldFinalDealResponseType } from "../types";
import GoldSummaryModal from "./GoldSummaryModal";

export default function BuyGoldScreen() {
  const { t } = useTranslation();
  const [selectedWeight, setSelectedWeight] = useState<number>(0);
  const [isBuyGoldSummaryModal, setIsBuyGoldSummaryModal] = useState<boolean>(false);
  const navigation = useNavigation();

  const otpFlow = useOtpFlow();
  const { mutateAsync, isLoading: isAcceptingTheDeal } = useAcceptGoldFinalDeal();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const handleOnContinuePress = async (weight: number) => {
    try {
      setSelectedWeight(weight);
      setIsBuyGoldSummaryModal(true);
    } catch (error) {}
  };

  const handleOnAcceptDeal = async (finalDealData: GoldFinalDealResponseType) => {
    try {
      await mutateAsync({
        ...finalDealData,
        Status: DealStatusEnum.ACCEPT,
        walletId: goldMock.walletId,
        Type: TransactionTypeEnum.BUY,
      });
      otpFlow.handle({
        action: {
          to: "GoalGetter.GoalManagementSuccessfulScreen",
          params: {
            title: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.buyGoldLabel"),
            subtitle: t("Home.DashboardScreen.GoalGetter.GoalManagementSuccessfulScreen.buyGoldSubLabel"),
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
  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoldWallet.TradeGoldScreen.buyTitle")}
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
        <GoldTradeContent
          //TODO will be added when merging with khaled
          handleOnContinuePress={handleOnContinuePress}
          totalBalance={40000}
          marketPrice={220}
          goldWeightValue={0}
          walletWeight={0}
          tradeType={TransactionTypeEnum.BUY}
        />
      </ContentContainer>

      {isBuyGoldSummaryModal ? (
        <GoldSummaryModal
          isVisible={isBuyGoldSummaryModal}
          changeVisibility={setIsBuyGoldSummaryModal}
          walletId={goldMock.walletId}
          weight={selectedWeight}
          type={TransactionTypeEnum.BUY}
          measureUnit={MeasureUnitEnum.GM}
          marketStatus={MarketStatusEnum.OPEN}
          isAcceptingTheDeal={isAcceptingTheDeal}
          onAcceptDeal={handleOnAcceptDeal}
        />
      ) : null}
      <NotificationModal
        variant="error"
        title={t("GoldWallet.errorModal.title")}
        message={t("GoldWallet.errorModal.tryAgain")}
        isVisible={isErrorModalVisible}
        onClose={handleOnClose}
      />
    </Page>
  );
}

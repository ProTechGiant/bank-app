import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { GoldTradeContent } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import {
  DealStatusEnum,
  GoldFinalDealResponseType,
  MeasureUnitEnum,
  TransactionTypeEnum,
} from "@/types/GoldTransactions";

import { useAcceptFinalDeal, useOtpGeneration } from "../hooks/query-hooks";
import TransactionSummaryModal from "./TransactionSummaryModal";

export default function TradeGoldScreen() {
  const {
    params: { walletId, totalBalance, marketPrice, tradeType, marketStatus, walletWeight, goldWeight },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.TradeGoldScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, isLoading: isAcceptingTheDeal } = useAcceptFinalDeal();

  const otpFlow = useOtpFlow();
  const { mutateAsync: generateOtp } = useOtpGeneration();

  const [isTransactionSummaryModalVisible, setIsTransactionSummaryModalVisible] = useState<boolean>(false);
  const [selectedWeight, setSelectedWeight] = useState<number>(0);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  const handleOnContinuePress = async (weight: number) => {
    try {
      setSelectedWeight(weight);
      setIsTransactionSummaryModalVisible(true);
    } catch (error) {}
  };

  const handleOnAcceptDeal = async (finalDealData: GoldFinalDealResponseType) => {
    try {
      await mutateAsync({ ...finalDealData, Status: DealStatusEnum.ACCEPT, walletId, Type: tradeType });

      otpFlow.handle({
        action: {
          to: "GoldWallet.CompleteTransactionScreen",
          params: {
            transactionType: tradeType,
            walletId,
          },
        },
        otpVerifyMethod: "gold/otps/validate",
        otpOptionalParams: {
          Type: tradeType,
        },
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
        title={
          tradeType === TransactionTypeEnum.BUY
            ? t("GoldWallet.TradeGoldScreen.buyTitle")
            : t("GoldWallet.TradeGoldScreen.sellTitle")
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer>
        <GoldTradeContent
          handleOnContinuePress={handleOnContinuePress}
          totalBalance={totalBalance}
          marketPrice={marketPrice}
          walletWeight={tradeType === TransactionTypeEnum.SELL ? walletWeight : null}
          goldWeightValue={goldWeight}
          tradeType={tradeType}
        />
      </ContentContainer>
      {isTransactionSummaryModalVisible ? (
        <TransactionSummaryModal
          isVisible={isTransactionSummaryModalVisible}
          changeVisibility={setIsTransactionSummaryModalVisible}
          walletId={walletId}
          weight={selectedWeight}
          type={tradeType}
          measureUnit={MeasureUnitEnum.GM}
          marketStatus={marketStatus}
          onAcceptDeal={handleOnAcceptDeal}
          isAcceptingTheDeal={isAcceptingTheDeal}
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

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

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
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.TradeGoldScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, isLoading: isAcceptingTheDeal } = useAcceptFinalDeal();
  const { walletId, totalBalance, marketPrice, tradeType, marketStatus, walletWeight, goldWeight, isSummaryOPen } =
    params;
  const [isTransactionSummaryModalVisible, setIsTransactionSummaryModalVisible] = useState<boolean>(false);
  useEffect(() => {
    if (params) {
      setIsTransactionSummaryModalVisible(isSummaryOPen);
    }
  }, [params]);

  const otpFlow = useOtpFlow();
  const { mutateAsync: generateOtp } = useOtpGeneration();

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
          to: "GoldWallet.TradeGoldScreen",
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
        onFinish: status => {
          if (status === "success") {
            navigation.navigate("GoldWallet.CompleteTransactionScreen", {
              transactionType: tradeType,
              walletId,
            });
          } else if (status === "cancel") {
            navigation.navigate("GoldWallet.TradeGoldScreen", {
              isSummaryOPen: true,
              walletId,
              totalBalance,
              marketPrice,
              tradeType,
              marketStatus,
              walletWeight,
              goldWeight,
            });
          }
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

  const handleGoBackPress = () => {
    navigation.goBack();
  };
  return (
    <Page backgroundColor="neutralBase-60">
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
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
          handleGoBackPress={handleGoBackPress}
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

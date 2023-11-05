import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

import GoldTradeContent from "../components/GoldTradeContent";
import { MeasureUnitEnum, TransactionTypeEnum } from "../types";
import TransactionSummaryModal from "./TransactionSummaryModal";

export default function TradeGoldScreen() {
  const {
    params: { walletId, totalBalance, marketPrice, tradeType, marketStatus },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.TradeGoldScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isTransactionSummaryModalVisible, setIsTransactionSummaryModalVisible] = useState<boolean>(false);
  const [selectedWeight, setSelectedWeight] = useState<number>(0);

  const handleOnContinuePress = async (weight: number) => {
    try {
      setSelectedWeight(weight);
      setIsTransactionSummaryModalVisible(true);
    } catch (error) {}
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
        />
      </ContentContainer>
      <TransactionSummaryModal
        isVisible={isTransactionSummaryModalVisible}
        changeVisibility={setIsTransactionSummaryModalVisible}
        walletId={walletId}
        weight={selectedWeight}
        type={tradeType}
        measureUnit={MeasureUnitEnum.GM}
        marketStatus={marketStatus}
      />
    </Page>
  );
}

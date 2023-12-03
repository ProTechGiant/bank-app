import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "react-native";

import { GoldTradeContent } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import CloseEndButton from "@/components/NavHeader/CloseEndButton";
import Page from "@/components/Page";
import { MeasureUnitEnum, TransactionTypeEnum } from "@/features/GoldWallet/types";
import useNavigation from "@/navigation/use-navigation";
import { MarketStatusEnum } from "@/types/timer";

import GoldSummaryModal from "./GoldSummaryModal";

export default function BuyGoldScreen() {
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
        <GoldTradeContent handleOnContinuePress={handleOnContinuePress} totalBalance={40000} marketPrice={220} />
      </ContentContainer>

      {isBuyGoldSummaryModal ? (
        <GoldSummaryModal
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
    </Page>
  );
}

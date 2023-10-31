import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

import GoldTradeContent from "../components/GoldTradeContent";
import { useTradeGold } from "../hooks/query-hooks";
import { TradeTypeEnum } from "../types";

export default function TradeGoldScreen() {
  const {
    params: { walletId, totalBalance, marketPrice, tradeType },
  } = useRoute<RouteProp<AuthenticatedStackParams, "GoldWallet.TradeGoldScreen">>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync, isLoading: isSubmitting } = useTradeGold();

  const handleOnContinuePress = async (weight: number) => {
    const data = {
      WalletId: walletId,
      Weight: weight,
      Type: tradeType,
      MeasureUnit: 1,
    };
    try {
      await mutateAsync(data);
    } catch (error) {}
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={
          tradeType === TradeTypeEnum.BUY
            ? t("GoldWallet.TradeGoldScreen.buyTitle")
            : t("GoldWallet.TradeGoldScreen.sellTitle")
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer>
        <GoldTradeContent
          //    type={TradeTypeEnum.BUY}
          handleOnContinuePress={handleOnContinuePress}
          totalBalance={totalBalance}
          marketPrice={marketPrice}
          isSubmitting={isSubmitting}
        />
      </ContentContainer>
    </Page>
  );
}

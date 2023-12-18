import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { HeaderContent, MutualFundProductsListView, PerformanceChart, ProductDetailsHeader } from "../components";
import { useAssetAllocation, useGetProductDetails } from "../hooks/query-hooks";
import { MutualFundStackParams } from "../MutualFundStack";
import { RiskEnum, RiskType } from "../types";

export default function ProductDetails() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.ProductDetails">>();
  const [selectedRisk] = useState<RiskType>(RiskEnum.LOW);

  const { data: assetAllocationData } = useAssetAllocation(selectedRisk);
  const { data } = useGetProductDetails(route.params.id);

  const handleOnSell = () => {
    // TODO: the functionality wil be add in next build cycle
  };

  const handleByMore = async () => {
    // TODO: the functionality wil be add in next build cycle
  };

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.ProductDetails:Page">
      <HeaderContent headerTitle={t("MutualFund.PortfolioDetailsHeaderContent.Portfolios")} showInfoIndicator={true}>
        <ProductDetailsHeader id={route.params.id} />
      </HeaderContent>
      <ScrollView style={style.flex1}>
        <ContentContainer style={contentContainerStyle}>
          {assetAllocationData !== undefined && data !== undefined ? (
            <PerformanceChart
              investmentAmount={data?.InvestedAmount}
              performance={assetAllocationData.Last3YearsPerformance}
            />
          ) : null}
          <MutualFundProductsListView assetAllocationData={assetAllocationData} />
        </ContentContainer>
      </ScrollView>
      <View style={buttonContainerStyle}>
        <View style={buttonStyle}>
          <Button onPress={handleOnSell} testID="MutualFund.ProductDetails:Sell-Button">
            {t("MutualFund.ProductDetails.sellButton")}
          </Button>
        </View>
        <View style={buttonStyle}>
          <Button onPress={handleByMore} variant="tertiary" testID="MutualFund.ProductDetails:Buy-Button">
            {t("MutualFund.ProductDetails.butMoreButton")}
          </Button>
        </View>
      </View>
    </Page>
  );
}

const style = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

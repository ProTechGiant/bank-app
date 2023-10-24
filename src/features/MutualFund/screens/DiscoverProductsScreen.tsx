import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, useWindowDimensions, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ErrorSection, FilterSection, MutualFundOffersItem } from "../components";
import { useGetMutualFundProducts } from "../hooks/query-hooks";

export default function DiscoverProductsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const { data: filteredProducts, isLoading, isError, refetch } = useGetMutualFundProducts(selectedFilter);
  const { width } = useWindowDimensions();

  useEffect(() => {
    refetch();
  }, [selectedFilter]);

  const handleToggleExpansion = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleOnBackPress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleOnClosePress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleGoBackPress = () => {
    navigation.goBack();
  };

  const handleOnFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleOnViewDetailsPress = (id: string) => {
    navigation.navigate("MutualFund.MutualFundDetailsScreen", { id });
  };

  const loadingContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderRadius: theme.radii.small,
      height: width - theme.spacing["64p"],
      width: width - theme.spacing["64p"],
      justifyContent: "center",
    }),
    [width]
  );

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader
        title={t("MutualFund.DiscoverProductsScreen.title")}
        onBackPress={handleOnBackPress}
        end={
          <NavHeader.IconEndButton
            icon={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={handleOnClosePress} />}
            onPress={handleOnClosePress}
          />
        }
      />

      <FilterSection onFilterChange={handleOnFilterChange} />

      <ContentContainer isScrollView>
        {isLoading ? (
          <View style={loadingContainerStyle}>
            <ActivityIndicator />
          </View>
        ) : filteredProducts && filteredProducts.ProductsList.length > 0 ? (
          filteredProducts.ProductsList.map((product, index) => {
            return (
              <MutualFundOffersItem
                key={product.Id}
                id={product.Id}
                name={product.Name}
                YTD={product.YTD}
                NAV={product.NAV}
                subscriptionFee={product.SubscriptionFees}
                minimumSubscription={product.MinimumSubscriptionAmount}
                minimumAdditionalSubscription={product.MinimumAdditionalSubscriptionAmount}
                dealingDays={product.DealingDays}
                dividend={product.Dividend}
                frequency={product.DealingDaysFrequency}
                strategy={product.Strategy}
                risk={product.RiskLevel}
                index={index}
                onToggleExpansion={handleToggleExpansion}
                isExpanded={expandedIndex === index}
                onViewDetailsPress={handleOnViewDetailsPress}
                assetsAllocation={product.AssetsAllocation}
              />
            );
          })
        ) : selectedFilter === "All" || isError ? (
          <ErrorSection
            title={t("MutualFund.DiscoverProductsScreen.errorSection.title")}
            description={t("MutualFund.DiscoverProductsScreen.errorSection.descriptionCaseAll")}
            onPress={handleGoBackPress}
          />
        ) : (
          <ErrorSection
            title={t("MutualFund.DiscoverProductsScreen.errorSection.title")}
            description={t("MutualFund.DiscoverProductsScreen.errorSection.desciptopmCaseRisk")}
            onPress={handleGoBackPress}
          />
        )}
      </ContentContainer>
    </Page>
  );
}

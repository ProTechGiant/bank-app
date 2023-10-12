import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { ErrorSection, FilterSection, MutualFundOffersItem } from "../components";
import mockOffersProducts from "../mocks/mockProductList";
import { Product } from "../types";

export default function DiscoverProductsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    mockOffersProducts ? mockOffersProducts.productsList : []
  );

  useEffect(() => {
    if (selectedFilters.length > 0) {
      const filteredList = mockOffersProducts.productsList.filter(product =>
        selectedFilters.includes(product.riskLevel)
      );
      setFilteredProducts(filteredList);
    } else {
      setFilteredProducts(mockOffersProducts.productsList);
    }
  }, [selectedFilters]);

  const handleToggleExpansion = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnClosePress = () => {
    //TODO - add navigation here
  };

  const handleGoBackPress = () => {
    navigation.navigate("Home.HomeTabs");
  };

  const handleOnFilterChange = (filter: string) => {
    let updatedFilters: string[];

    if (filter === t("MutualFund.DiscoverProductsScreen.filterType.all")) {
      setFilteredProducts(mockOffersProducts.productsList);
    } else {
      if (selectedFilters.includes(filter)) {
        updatedFilters = selectedFilters.filter(item => item !== filter);
      } else {
        updatedFilters = [...selectedFilters, filter];
      }

      if (updatedFilters.length === 0) {
        setFilteredProducts(mockOffersProducts.productsList);
      } else {
        const filteredList = mockOffersProducts.productsList.filter(product =>
          updatedFilters.some(filter => product.riskLevel === filter)
        );
        setFilteredProducts(filteredList);
      }
      setSelectedFilters(updatedFilters);
    }
  };

  const handleOnViewDetailsPress = () => {
    navigation.navigate("MutualFund.MutualFundDetailsScreen");
  };

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
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => {
            return (
              <MutualFundOffersItem
                key={product.Id}
                id={product.Id}
                name={product.Name}
                YTD={product.YTD}
                NAV={product.NAV}
                subscriptionFee={product.subscriptionFees}
                minimumSubscription={product.minimumSubscriptionAmount}
                minimumAdditionalSubscription={product.minimumAdditionalSubscriptionAmount}
                dealingDays={product.dealingDays}
                dividend={product.dividend}
                frequency={product.dealingDaysFrequency}
                strategy={product.strategy}
                risk={product.risk}
                index={index}
                onToggleExpansion={handleToggleExpansion}
                isExpanded={expandedIndex === index}
                handleOnViewDetailsPress={handleOnViewDetailsPress}
              />
            );
          })
        ) : (
          <ErrorSection
            title={t("MutualFund.DiscoverProductsScreen.errorSection.title")}
            description={t("MutualFund.DiscoverProductsScreen.errorSection.description")}
            onPress={handleGoBackPress}
          />
        )}
      </ContentContainer>
    </Page>
  );
}

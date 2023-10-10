import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CloseIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { ErrorSection, FilterSection, MutualFundOffersItem } from "../components";
import mockOffersProducs from "../mocks/mockProductList";

export default function DiscoverProductsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
    //TODO - add navigation here
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

      <FilterSection />

      <ContentContainer isScrollView>
        {mockOffersProducs ? (
          mockOffersProducs.productsList.map((product, index) => {
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

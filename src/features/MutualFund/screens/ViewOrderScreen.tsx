import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";

import { Stack, Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { FilterTopBar, OrderItem } from "../components";
import { useGetOrderList } from "../hooks/query-hooks";
import { Order } from "../types";

export default function ViewOrderScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [filteredOrders, setFilteredOrders] = useState<Order[] | undefined>([]);
  const { data, isError, isLoading } = useGetOrderList();

  useEffect(() => {
    const filteredOrders = data?.OrdersList.filter(order => {
      if (selectedFilter === "All") {
        return true;
      } else {
        return order.OrderStatus === selectedFilter;
      }
    });

    setFilteredOrders(filteredOrders);
  }, [selectedFilter]);

  const handleOnFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };
  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.ViewOrderScreen:Page">
      <NavHeader
        variant="white"
        title={t("MutualFund.ViewOrdersScreen.title")}
        testID="MutualFund.ViewOrdersScreen:NavHeader"
        withBackButton={true}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : !isError ? (
        <>
          <FilterTopBar selectedFilter={selectedFilter} onFilterChange={handleOnFilterChange} />
          <ContentContainer>
            <Typography.Text size="footnote" weight="regular">
              {t("MutualFund.ViewOrdersScreen.orders")}
            </Typography.Text>
          </ContentContainer>
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="16p">
              {filteredOrders
                ? filteredOrders.map(el => {
                    return (
                      <OrderItem
                        name={el.Product.Name}
                        status={el.OrderStatus}
                        units={`${el.OrderUnitPrice}`}
                        investedValue={`${el.OrderAmount}`}
                        risk={el.Risk}
                        expectedReturn={el.ExpectedReturns ? el.ExpectedReturns : undefined}
                        code={el.Portfolio.Code}
                      />
                    );
                  })
                : null}
            </Stack>
          </ContentContainer>
        </>
      ) : null}
    </Page>
  );
}

import { format } from "date-fns";
import arLocale from "date-fns/locale/ar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, Pressable } from "react-native";

import { CalendarCircleIcon } from "@/assets/icons";
import { Stack } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import DateRangePicker from "@/components/DateRangePicker";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

import { FilterTopBar } from "../components";
import TransactionItem from "../components/TransactionItem";
import { useGetOrderList } from "../hooks/query-hooks";
import { Order } from "../types";

export default function MutualFundOrderScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [filteredOrders, setFilteredOrders] = useState<Order[] | undefined>([]);
  const { data, isError, isLoading } = useGetOrderList();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

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

  const handleOnSelectDate = (date: Date) => {
    const newDate = I18nManager.isRTL
      ? format(date, "dd MMMM yyyy", { locale: arLocale })
      : format(date, "dd MMMM yyyy");
    setSelectedDate(newDate);
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]} testID="MutualFund.ViewOrderScreen:Page">
      <NavHeader
        variant="white"
        title={t("MutualFund.MutualFundOrderScreen.title")}
        testID="MutualFund.ViewOrdersScreen:NavHeader"
        withBackButton={true}
        end={
          <Pressable onPress={() => setIsVisible(true)}>
            <CalendarCircleIcon />
          </Pressable>
        }
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : !isError ? (
        <>
          <FilterTopBar selectedFilter={selectedFilter} onFilterChange={handleOnFilterChange} />
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="16p">
              {filteredOrders
                ? filteredOrders.map(el => {
                    return (
                      <TransactionItem
                        name={el.Product.Name}
                        status={el.OrderStatus}
                        investedValue={`${el.OrderAmount}`}
                        orderType={el.OrderType}
                        tradeTime={el.TradeDateTime ? el.TradeDateTime : undefined}
                        code={el.Portfolio.Code}
                        orderCurrency={el.OrderCurrency}
                      />
                    );
                  })
                : null}
            </Stack>
            <DateRangePicker
              isVisible={isVisible}
              onDateSelected={handleOnSelectDate}
              currentDate={selectedDate}
              onClose={() => setIsVisible(false)}
              withDuration={false}
            />
          </ContentContainer>
        </>
      ) : null}
    </Page>
  );
}

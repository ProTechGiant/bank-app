import { format, isWithinInterval } from "date-fns";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SectionList, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { CalendarIcon } from "@/assets/icons/CalendarIcon";
import DateRangePickerModal from "@/components/DateRangePickerModal";
import EmptySearchResult from "@/components/EmptySearchResult";
import FullScreenLoader from "@/components/FullScreenLoader";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { spacing } from "@/theme/values";

import BillItemCard from "../components/BillItemCard";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useBillPaymentHistory } from "../hooks/query-hooks";
import { BillHistorySectionList, BillItem } from "../types";

export default function BillPaymentHistoryScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [searchSavedGroupedBills, setSearchSavedGroupedBills] = useState<BillHistorySectionList[]>([]);
  const [isDateFilterModalVisible, setIsDateFilterModalVisible] = useState(false);
  const [isFilteredResult, setIsFilteredResult] = useState(false);
  const [selectedDateSearchRange, setSelectedDateSearchRange] = useState("");
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const { setNavigationType, clearContext } = useSadadBillPaymentContext();
  const navigation = useNavigation();

  const { data: billPayments, isLoading, isError, refetch } = useBillPaymentHistory();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["12p"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-20"],
    marginBottom: theme.spacing["4p"],
  }));

  // grouping the data making it section list.
  const getGroupedBillsArrayByDate = (actualArray: BillItem[]) => {
    const items: BillHistorySectionList[] = Object.entries(
      groupBy(actualArray, bill => format(new Date(bill.DueDate), "d MMMM yyyy"))
    ).map(([title, entries]) => {
      return { title, data: entries };
    });

    return items;
  };

  const handleOnCancelPress = () => {
    setSearchText("");
  };

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCalenderIconPressed = () => {
    setIsDateFilterModalVisible(true);
  };

  const handleOnItemPressed = (item: BillItem) => {
    clearContext();
    setNavigationType("paymentHistory");
    navigation.navigate("SadadBillPayments.PaymentHistoryDetailScreen", { PaymentId: item.PaymentId });
  };

  const handleDateFilterConfirm = (startDay: string, endDay: string) => {
    if (billPayments === undefined) {
      return;
    }
    setIsFilteredResult(true);
    let selectedDateRange = "";
    const startDate = new Date(startDay);
    const endDate = new Date(endDay);
    selectedDateRange = `${format(
      startDate,
      `do${startDate.getMonth() !== endDate.getMonth() ? " MMM" : ""}${
        startDate.getFullYear() !== endDate.getFullYear() ? " yyyy" : ""
      }`
    )} - ${format(endDate, "do MMM yyyy")}`;
    setSelectedDateSearchRange(selectedDateRange);

    const filteredArray = billPayments.filter(p => {
      const paymentDate = new Date(p.DueDate);
      return isWithinInterval(new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate()), {
        start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
      });
    });
    setSearchSavedGroupedBills(getGroupedBillsArrayByDate(filteredArray));
  };

  const handleOnClearDateFilter = () => {
    setIsFilteredResult(false);
    if (billPayments !== undefined) {
      setSearchSavedGroupedBills(getGroupedBillsArrayByDate(billPayments));
    }
  };

  // applying search filter.
  useEffect(() => {
    if (billPayments === undefined) {
      setSearchSavedGroupedBills([]);
      return;
    }
    const debounceId = setTimeout(() => {
      // filtering the actual data
      const lowerCaseQuery = searchText.toLowerCase();

      const filteredArray =
        searchText !== ""
          ? billPayments.filter(function (billObj) {
              return (
                billObj.AccountNumber?.toLowerCase().match(lowerCaseQuery) ||
                billObj.BillName?.toLowerCase().match(lowerCaseQuery)
              );
            })
          : billPayments;

      // grouping it to section list.
      setSearchSavedGroupedBills(getGroupedBillsArrayByDate(filteredArray));
    }, 500);
    return () => clearTimeout(debounceId);
  }, [billPayments, searchText]);

  // showing error if api failed to get response.
  useEffect(() => {
    setIsLoadingErrorVisible(isError);
  }, [isError]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          withBackButton={true}
          title={t("SadadBillPayments.BillPaymentHistoryScreen.paymentHistory")}
          end={
            <Pressable onPress={() => handleOnCalenderIconPressed()}>
              <CalendarIcon />
            </Pressable>
          }
        />
        <View style={containerStyle}>
          <Stack justify="space-around" direction="vertical" gap="24p" align="stretch" flex={1}>
            {!isFilteredResult ? (
              <SearchInput
                onClear={handleOnCancelPress}
                onSearch={handleOnChangeText}
                placeholder={t("SadadBillPayments.BillPaymentHistoryScreen.searchPlaceholder")}
                value={searchText}
              />
            ) : (
              <Stack direction="horizontal" align="center" gap="8p">
                <Typography.Text>{t("SadadBillPayments.BillPaymentHistoryScreen.filterBy")}</Typography.Text>
                <Stack direction="horizontal">
                  <View style={optionContainerStyle}>
                    <Typography.Text>{selectedDateSearchRange}</Typography.Text>
                    <Pressable onPress={handleOnClearDateFilter}>
                      <CloseIcon width={spacing["16p"]} height={spacing["16p"]} />
                    </Pressable>
                  </View>
                </Stack>
              </Stack>
            )}
            {isLoading ? (
              <FullScreenLoader />
            ) : (
              <>
                {searchSavedGroupedBills.length > 0 ? (
                  <SectionList
                    sections={searchSavedGroupedBills}
                    renderItem={({ item }) => (
                      <BillItemCard key={item.BillerId} data={item} onPress={() => handleOnItemPressed(item)} />
                    )}
                    renderSectionHeader={({ section }) => (
                      <Typography.Text size="callout" weight="regular" color="neutralBase" style={sectionTitleStyle}>
                        {section.title}
                      </Typography.Text>
                    )}
                  />
                ) : (
                  <EmptySearchResult />
                )}
              </>
            )}
            <LoadingErrorNotification
              isVisible={isLoadingErrorVisible}
              onClose={() => setIsLoadingErrorVisible(false)}
              onRefresh={() => refetch()}
            />
          </Stack>
        </View>
      </Page>
      <DateRangePickerModal
        isVisible={isDateFilterModalVisible}
        onClose={() => setIsDateFilterModalVisible(false)}
        onConfirm={handleDateFilterConfirm}
      />
    </>
  );
}

import { format } from "date-fns";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, SectionList, View, ViewStyle } from "react-native";

import { CalendarIcon } from "@/assets/icons/CalendarIcon";
import EmptySearchResult from "@/components/EmptySearchResult";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BillItemCard from "../components/BillItemCard";
import { savedBillHistoryMockData } from "../mocks/MockBillDetails";
import { BillHistorySectionList, BillItem } from "../types";

export default function BillPaymentHistoryScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [searchSavedGroupedBills, setSearchSavedGroupedBills] = useState<BillHistorySectionList[]>([]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["12p"],
  }));

  useEffect(() => {
    // TODO: populating it with the mock data.
    setSearchSavedGroupedBills(getGroupedBillsArrayByDate(savedBillHistoryMockData));
  }, []);

  // grouping the data making it section list.
  const getGroupedBillsArrayByDate = (actualArray: BillItem[]) => {
    const array: BillHistorySectionList[] = [];
    // TODO: currently implemented with mock data.
    const groupedByDateBillsArray = groupBy(actualArray, bill => format(new Date(bill.DueDate), "d MMMM yyyy"));

    Object.entries(groupedByDateBillsArray).map(([key, value]) => {
      const groupBill: BillHistorySectionList = { title: "", data: [] };
      groupBill.title = key;
      groupBill.data = value;
      array.push(groupBill);
    });
    return array;
  };
  const handleOnCancelPress = () => {
    setSearchText("");
  };

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCalenderIconPressed = () => {
    // Calender on press.
  };

  // applying search filter.
  useEffect(() => {
    const debounceId = setTimeout(() => {
      // filtering the actual data
      const filteredArray = savedBillHistoryMockData.filter(function (billObj) {
        return billObj.AccountNumber.match(searchText) || billObj.BillName.match(searchText);
      });
      // grouping it to section list.
      setSearchSavedGroupedBills(getGroupedBillsArrayByDate(filteredArray));
    }, 500);
    return () => clearTimeout(debounceId);
  }, [searchText]);

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
            <SearchInput
              onClear={handleOnCancelPress}
              onSearch={handleOnChangeText}
              placeholder={t("SadadBillPayments.BillPaymentHistoryScreen.searchPlaceholder")}
              value={searchText}
            />
            {searchSavedGroupedBills.length > 0 ? (
              <SectionList
                sections={searchSavedGroupedBills}
                renderItem={({ item }) => (
                  <BillItemCard
                    key={item.AccountNumber}
                    data={item}
                    onPress={() => {
                      //TODO: will be implemented later on.
                    }}
                  />
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
          </Stack>
        </View>
      </Page>
    </>
  );
}

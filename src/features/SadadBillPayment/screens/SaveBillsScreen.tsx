import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import EmptySearchResult from "@/components/EmptySearchResult";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import BillItemCard from "../components/BillItemCard";
import { MockBillDetails } from "../mocks/MockBillDetails";

export default function SaveBillsScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>("");
  // TODO: currently implemented with mock data.
  const [searchedUsedBills, setSearchedUsedBills] = useState(MockBillDetails);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCancelPress = () => {
    setSearchText("");
  };

  useEffect(() => {
    const debounceId = setTimeout(() => {
      const filteredArray = MockBillDetails.filter(function (billObj) {
        return billObj.AccountNumber.match(searchText) || billObj.BillName.match(searchText);
      });
      setSearchedUsedBills(filteredArray);
    }, 500);
    return () => clearTimeout(debounceId);
  }, [searchText]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={true} title={t("SadadBillPayments.SavedBillScreen.savedBill")} />
        <View style={containerStyle}>
          <Stack justify="space-around" direction="vertical" gap="24p" align="stretch" flex={1}>
            <SearchInput
              onClear={handleOnCancelPress}
              onSearch={handleOnChangeText}
              placeholder={t("SadadBillPayments.SavedBillScreen.searchPlaceholder")}
              value={searchText}
            />
            {searchedUsedBills.length > 0 ? (
              <FlatList
                data={searchedUsedBills}
                renderItem={({ item }) => (
                  <BillItemCard
                    key={item.key}
                    data={item}
                    onPress={() => {
                      //TODO: will be implemented later on.
                    }}
                  />
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

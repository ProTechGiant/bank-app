import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import EmptySearchResult from "@/components/EmptySearchResult";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BillItemCard from "../components/BillItemCard";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { MockBillDetails } from "../mocks/MockBillDetails";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";
import { BillItem } from "../types";

export default function SaveBillsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setNavigationType } = useSadadBillPaymentContext();

  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.SaveBillsScreen">>();

  const [searchedUsedBills, setSearchedUsedBills] = useState(MockBillDetails);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const debounceId = setTimeout(() => {
      const filteredArray = MockBillDetails.filter(function (billObj) {
        return billObj.AccountNumber.match(searchText) || billObj.BillName.match(searchText);
      });
      setSearchedUsedBills(filteredArray);
    }, 500);
    return () => clearTimeout(debounceId);
  }, [searchText]);

  const handleOnChangeText = (text: string) => {
    if (text === " " && searchText === "") return;
    else setSearchText(text);
  };

  const handleOnCancelPress = () => {
    setSearchText("");
  };

  const handleOnItemPress = (item: BillItem) => {
    if (route.params.navigationFlow === "paymentDue") {
      setNavigationType("payBill");
      navigation.navigate("SadadBillPayments.BillDescriptionScreen", {
        category: "Internet",
        AccountNumber: item.AccountNumber,
        BillDescription: item.BillName,
        biller: item.BillName,
      });
    }
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginTop: theme.spacing["20p"],
    flex: 1,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={
          route.params.navigationFlow === "paymentDue"
            ? t("SadadBillPayments.SavedBillScreen.payBill")
            : t("SadadBillPayments.SavedBillScreen.savedBill")
        }
      />
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
                <BillItemCard key={item.key} data={item} onPress={() => handleOnItemPress(item)} />
              )}
            />
          ) : (
            <EmptySearchResult />
          )}
        </Stack>
      </View>
    </Page>
  );
}

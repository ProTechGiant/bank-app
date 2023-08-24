import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, ViewStyle } from "react-native";

import EmptySearchResult from "@/components/EmptySearchResult";
import FullScreenLoader from "@/components/FullScreenLoader";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BillItemCard from "../components/BillItemCard";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useSavedBills } from "../hooks/query-hooks";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";
import { BillItem } from "../types";

export default function SaveBillsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setNavigationType } = useSadadBillPaymentContext();
  const { data: savedBills, isLoading, isError, refetch } = useSavedBills();

  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.SaveBillsScreen">>();

  const [searchedUsedBills, setSearchedUsedBills] = useState<BillItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);

  useEffect(() => {
    if (savedBills === undefined) {
      setSearchedUsedBills([]);
      return;
    }
    const debounceId = setTimeout(() => {
      const filteredArray =
        searchText !== ""
          ? savedBills.filter(function (billObj) {
              return (
                billObj.AccountNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
                billObj.BillName?.toLowerCase().includes(searchText.toLowerCase())
              );
            })
          : savedBills;
      setSearchedUsedBills(filteredArray);
    }, 500);
    return () => clearTimeout(debounceId);
  }, [savedBills, searchText]);

  // showing error if api failed to get response.
  useEffect(() => {
    setIsLoadingErrorVisible(isError);
  }, [isError]);

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
      navigation.navigate("SadadBillPayments.BillDetailsScreen", {
        AccountNumber: item.AccountNumber,
        billerId: item.BillerId,
      });
    } else if (route.params.navigationFlow === "savedBills") {
      navigation.navigate("SadadBillPayments.BillDetailsScreen", {
        AccountNumber: item.AccountNumber,
        billerId: item.BillerId,
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
          {isLoading ? (
            <FullScreenLoader />
          ) : (
            <>
              {searchedUsedBills.length > 0 ? (
                <FlatList
                  data={searchedUsedBills}
                  renderItem={({ item }) => (
                    <BillItemCard key={item.BillerId} data={item} onPress={() => handleOnItemPress(item)} />
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
  );
}

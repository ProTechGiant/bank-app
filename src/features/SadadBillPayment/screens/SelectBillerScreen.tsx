import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CategoryList } from "../components";
import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { Biller } from "../types";

export default function SelectBillerScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { billDetails, setBillDetails } = useSadadBillPaymentContext();

  const searchInputRef = useRef<TextInput>(null);
  const [billers, setBillers] = useState<Biller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const billIssuersList = useMemo(() => billDetails?.Category?.BillersList ?? [], [billDetails]);

  useEffect(() => {
    setBillers(billIssuersList);
  }, [billIssuersList]);

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const searchResults = billIssuersList?.filter(biller => {
      return (
        biller.NameEn?.toLowerCase().includes(lowerCaseQuery) ||
        biller.NameAr?.toLowerCase().includes(lowerCaseQuery) ||
        biller.Id.includes(lowerCaseQuery)
      );
    });
    setBillers(searchResults);
  };

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setBillers(billIssuersList);
    searchInputRef.current?.blur();
  };

  const handleOnSubCategorySelect = (value: Biller) => {
    setBillDetails({ ...billDetails, BillIssuer: value });
    navigation.goBack();
    navigation.navigate("SadadBillPayments.EnterAccountNoScreen");
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const searchContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader />
        <ContentContainer isScrollView style={mainContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {i18n.language === "en" ? billDetails.Category?.NameEn : billDetails.Category?.NameAr}
          </Typography.Text>
          <Typography.Text size="callout" color="neutralBase+10" weight="regular">
            {t("SadadBillPayments.SelectBillerScreen.selectBillerText")}
          </Typography.Text>
          <Stack style={searchContainerStyle} direction="vertical">
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              placeholder={t("SadadBillPayments.SelectBillerScreen.searchPlaceholder")}
              onSearch={handleOnSearch}
              onClear={handleOnSearchClear}
            />
          </Stack>
          <Stack style={listContainerStyle} direction="horizontal">
            <CategoryList data={billers} onSelect={handleOnSubCategorySelect} />
          </Stack>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

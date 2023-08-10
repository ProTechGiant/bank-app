import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, ViewStyle } from "react-native";

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
import { useBillerCategories } from "../hooks/query-hooks";
import { BillerCategory } from "../types";

export default function SelectBillerCategoryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { setBillDetails, navigationType } = useSadadBillPaymentContext();
  const [page, setPage] = useState(0);

  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // maintaining two list one with actual paginated list and other one is search filtered list.
  const [actualCategoryList, setActualCategoryList] = useState<BillerCategory[]>([]);
  const [categories, setCategories] = useState<BillerCategory[]>([]);

  const { data, isLoading, isFetching } = useBillerCategories(PAGE_SIZE, page);

  useEffect(() => {
    if (data !== undefined && data.CategoriesList !== undefined) {
      // paginated list when newly data is fetched.
      const array = [...actualCategoryList, ...data.CategoriesList];
      setActualCategoryList(array);
      setCategories(array);
    }
  }, [data]);

  const handleOnEndReached = () => {
    // checking if its the last data then no need to increment page.
    if (page > 0 && data?.CategoriesList === undefined) return;
    if (!isFetching && !isLoading) setPage(page + 1);
  };

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const searchResults = actualCategoryList.filter(billerCategory => {
      return (
        billerCategory.NameEn?.toLowerCase().includes(lowerCaseQuery) ||
        billerCategory.NameAr?.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setCategories(searchResults);
  };

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setCategories(actualCategoryList);
    searchInputRef.current?.blur();
  };

  const handleOnCategorySelect = (value: BillerCategory) => {
    setBillDetails({ category: value });
    navigation.navigate("SadadBillPayments.SelectBillerScreen");
  };

  const mainContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const searchContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
  }));

  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    flex: 1,
  }));

  return (
    <Page>
      <NavHeader end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      <ContentContainer style={mainContainerStyle}>
        <Typography.Text color="neutralBase+30" size="title1" weight="medium">
          {navigationType === "oneTimePayment"
            ? t("SadadBillPayments.SelectBillerCategoryScreen.oneTimePaymentTitle")
            : t("SadadBillPayments.SelectBillerCategoryScreen.addNewBillTitle")}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase+10" weight="regular">
          {t("SadadBillPayments.SelectBillerCategoryScreen.selectBillerCategoryText")}
        </Typography.Text>
        <Stack style={searchContainerStyle} direction="vertical">
          <SearchInput
            ref={searchInputRef}
            value={searchQuery}
            placeholder={t("SadadBillPayments.SelectBillerCategoryScreen.searchPlaceholder")}
            onSearch={handleOnSearch}
            onClear={handleOnSearchClear}
          />
        </Stack>
        <Stack style={listContainerStyle} direction="horizontal">
          <CategoryList
            isFetching={isFetching}
            data={categories}
            onSelect={handleOnCategorySelect}
            onEndReached={handleOnEndReached}
          />
        </Stack>
      </ContentContainer>
    </Page>
  );
}

const PAGE_SIZE = 20;

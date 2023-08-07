import { useRef, useState } from "react";
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
import { MockBillerCategory } from "../mocks/MockBillerCategory";

export default function SelectBillerCategoryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { setBillDetails, navigationType } = useSadadBillPaymentContext();

  const searchInputRef = useRef<TextInput>(null);
  const [billers, setBillers] = useState(MockBillerCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = MockBillerCategory.filter(biller => {
      const lowerCaseQuery = query.toLowerCase();
      return biller.toLowerCase().includes(lowerCaseQuery);
    });
    setBillers(searchResults);
  };

  const handleOnCategorySelect = (value: string) => {
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
          />
        </Stack>
        <Stack style={listContainerStyle} direction="horizontal">
          <CategoryList data={billers} onSelect={handleOnCategorySelect} />
        </Stack>
      </ContentContainer>
    </Page>
  );
}

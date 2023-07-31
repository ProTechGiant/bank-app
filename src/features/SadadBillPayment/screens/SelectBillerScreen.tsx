import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
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

import CategoryList from "../components/CategoryList";
import { MockBillers } from "../mocks/MockBillerList";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

export default function SelectBillerScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);
  const [billers, setBillers] = useState(MockBillers);
  const [searchQuery, setSearchQuery] = useState("");

  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.SelectBillerScreen">>();

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = MockBillers.filter(biller => {
      const lowerCaseQuery = query.toLowerCase();
      return biller.toLowerCase().includes(lowerCaseQuery);
    });
    setBillers(searchResults);
  };

  const handleOnSubCategorySelect = (value: string) => {
    navigation.goBack();
    navigation.navigate("SadadBillPayments.EnterAccountNoScreen", {
      ...route.params,
      category: route.params.category,
      biller: value,
    });
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
        <ContentContainer style={mainContainerStyle}>
          <Typography.Text color="neutralBase+30" size="title1" weight="medium">
            {route.params.category}
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

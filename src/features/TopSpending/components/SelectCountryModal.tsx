import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Pressable, SectionList, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import { SearchInput } from "@/components/Input";
import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { mockCountryList } from "../../../mocks/countryListData";
import { convertToCountryList } from "../utils/country-list-converter";

interface SelectCountryModalProps {
  handleSelectCountry: (country: string) => void;
}

export default function SelectCountryModal({ handleSelectCountry }: SelectCountryModalProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();
  const modalHeight = screenHeight * 0.8;
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [countryListData, setCountryListData] = useState(() => convertToCountryList(mockCountryList));

  const handleOnSearch = (searchQuery: string) => {
    setSearchCountry(searchQuery);
    setCountryListData(
      convertToCountryList(
        mockCountryList.filter(country => country.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  };

  const countryItemContainer = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }));

  const modalTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
  }));

  const sectionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  const renderItem = ({ item }: { item: string }) => (
    <Pressable style={countryItemContainer} onPress={() => setSelectedCountry(item)}>
      <Typography.Text size="callout">{item}</Typography.Text>
      <Radio isSelected={item === selectedCountry} onPress={() => setSelectedCountry(item)} />
    </Pressable>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={sectionHeaderStyle}>
      <Typography.Text size="caption1" weight="semiBold" color="neutralBase+10">
        {title}
      </Typography.Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ height: modalHeight }}>
      <Typography.Text size="title3" style={modalTitleStyle}>
        {t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.title")}
      </Typography.Text>
      <SearchInput
        onSearch={handleOnSearch}
        placeholder={t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.searchPlaceholder")}
        value={searchCountry}
      />
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={countryListData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, _index) => item.toString()}
      />
      <Button onPress={() => handleSelectCountry(selectedCountry)}>
        {t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.buttonText")}
      </Button>
    </KeyboardAvoidingView>
  );
}

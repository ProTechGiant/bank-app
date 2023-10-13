import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

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
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [countryListData, setCountryListData] = useState(() => convertToCountryList(mockCountryList));

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleOnSearch = (searchQuery: string) => {
    setSearchCountry(searchQuery);
    setCountryListData(
      convertToCountryList(
        mockCountryList.filter(country => country.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  };

  const modalStyle = {
    height: isKeyboardOpen && Platform.OS === "android" ? screenHeight * 0.45 : screenHeight * 0.8,
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
    <Pressable
      style={countryItemContainer}
      onPress={() => setSelectedCountry(item)}
      testID={`ViewTransactions.SelectTagScreen:SelectCountryModalCountry-${item}`}>
      <Typography.Text size="callout" style={styles.countryNameStyle}>
        {item}
      </Typography.Text>
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
    <KeyboardAvoidingView style={modalStyle}>
      <Typography.Text size="title3" style={modalTitleStyle}>
        {t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.title")}
      </Typography.Text>
      <SearchInput
        onSearch={handleOnSearch}
        placeholder={t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.searchPlaceholder")}
        testID="ViewTransactions.SelectTagScreen:SelectCountryModalSearchInput"
        value={searchCountry}
      />
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={countryListData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, _index) => item.toString()}
      />
      <Button
        onPress={() => handleSelectCountry(selectedCountry)}
        testID="ViewTransactions.SelectTagScreen:SelectCountryModalConfirmButton">
        {t("ViewTransactions.SingleTransactionDetailedScreen.tripToModal.buttonText")}
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  countryNameStyle: {
    maxWidth: "80%",
  },
});

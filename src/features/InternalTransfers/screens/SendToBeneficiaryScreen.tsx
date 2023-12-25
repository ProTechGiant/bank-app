import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import { CloseIcon, FilterIcon, PlusIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import EmptySearchResult from "@/components/EmptySearchResult";
import FullScreenLoader from "@/components/FullScreenLoader";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import { BeneficiaryList } from "../components";
import ViewBankFilterModal from "../components/ViewBankFilter";
import { useBeneficiaries } from "../hooks/query-hooks";
import { BeneficiaryType } from "../types";

function activeFilterCheck(beneficiaries: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
  return beneficiaries.filter(beneficiary => beneficiary.IVRValidated === isActive);
}

export default function SendToBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { transferType } = useInternalTransferContext();
  const { data, refetch, isLoading, isError } = useBeneficiaries();
  const searchInputRef = useRef<TextInput>(null);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const beneficiaries = useMemo(
    () => (data !== undefined && data.Beneficiary !== undefined ? data.Beneficiary : []),
    [data]
  );

  const activeBeneficiaries = activeFilterCheck(filteredBeneficiaries, true);

  useEffect(() => {
    setFilteredBeneficiaries(beneficiaries);
  }, [beneficiaries]);

  useEffect(() => {
    setIsLoadingErrorVisible(isError);
  }, [isError]);

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = beneficiaries.filter(beneficiary => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        beneficiary.Name.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.IBAN?.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredBeneficiaries(searchResults);
  };

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setFilteredBeneficiaries(data !== undefined && data.Beneficiary !== undefined ? data.Beneficiary : []);
    searchInputRef.current?.blur();
  };

  const handleNavigateToAddBeneficiaries = () => {
    if (transferType === TransferType.SarieTransferAction) {
      navigation.navigate("InternalTransfers.StandardTransferNewBeneficiaryScreen");
    } else {
      navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
    }
  };

  const handleClearAll = () => {
    setIsFilterVisible(false);
    setFilteredBeneficiaries(beneficiaries);
  };

  const handleOnBeneficiaryPress = () => {
    //TODO Handle Beneficiary Profile Navigation
  };

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 2,
    borderColor: theme.palette.primaryBase,
    justifyContent: "space-between",
  }));
  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const addIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 100,
  }));

  const removeFilter = (bankName: string) => {
    setFilteredBeneficiaries(prevFilters => prevFilters?.filter(item => item?.BankName !== bankName));
  };

  const filterContainerStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["4p"],
    marginTop: theme.spacing["24p"],
  }));

  const filterSpacingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginLeft: theme.spacing["8p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          end={
            <Stack direction="horizontal">
              <Pressable onPress={() => setIsFilterModalVisible(true)}>
                <FilterIcon />
              </Pressable>
            </Stack>
          }
          title="Beneficiaries"
          testID="InternalTransfers.SendToBeneficiaryScreen:NavHeader"
        />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled>
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
              {isFilterVisible ? (
                <Stack direction="horizontal" align="center" style={filterContainerStyle}>
                  <Typography.Text color="neutralBase" size="footnote" weight="regular">
                    {t("InternalTransfers.SendToBeneficiaryScreen.filteredBy")}
                  </Typography.Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filteredBeneficiaries
                      .filter((bank, index, array) => array.findIndex(b => b.BankName === bank.BankName) === index)
                      .map(type => (
                        <Pressable onPress={() => removeFilter(type.BankName)} style={optionContainerStyle}>
                          <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                            {type.BankName}
                          </Typography.Text>
                          <View style={filterSpacingStyle}>
                            <CloseIcon width={14} height={18} />
                          </View>
                        </Pressable>
                      ))}
                  </ScrollView>
                  <Pressable onPress={() => handleClearAll()}>
                    <Typography.Text color="neutralBase+30" size="footnote" weight="medium">
                      {t("InternalTransfers.SendToBeneficiaryScreen.clearAll")}
                    </Typography.Text>
                  </Pressable>
                </Stack>
              ) : (
                <Stack direction="vertical" gap="32p">
                  <SearchInput
                    ref={searchInputRef}
                    value={searchQuery}
                    placeholder={t("InternalTransfers.SendToBeneficiaryScreen.search.placeholder")}
                    onClear={handleOnSearchClear}
                    onSearch={handleOnSearch}
                    testID="InternalTransfers.SendToBeneficiaryScreen:SearchInput"
                  />
                  <Pressable
                    onPress={handleNavigateToAddBeneficiaries}
                    testID="InternalTransfers.SendToBeneficiaryScreen:AddBeneficiaryButton">
                    <Stack align="center" direction="horizontal" gap="12p">
                      <View style={addIconContainer}>
                        <PlusIcon color={iconColor} />
                      </View>
                      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                        {t("InternalTransfers.SendToBeneficiaryScreen.addNewBeneficiaryLink")}
                      </Typography.Text>
                    </Stack>
                  </Pressable>
                </Stack>
              )}
              {isLoading ? (
                <FullScreenLoader />
              ) : filteredBeneficiaries.length > 0 ? (
                <Stack direction="vertical" gap="20p" align="stretch">
                  {activeBeneficiaries.length > 0 ? (
                    <>
                      <BeneficiaryList
                        beneficiaries={filteredBeneficiaries}
                        transferType={transferType}
                        onBeneficiaryPress={handleOnBeneficiaryPress}
                        testID="InternalTransfers.SendToBeneficiaryScreen:ActiveBeneficiaries"
                      />
                    </>
                  ) : null}
                </Stack>
              ) : (
                <EmptySearchResult testID="InternalTransfers.SendToBeneficiaryScreen:EmptySearchResult" />
              )}
            </Stack>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <LoadingErrorNotification
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
        onRefresh={() => refetch()}
      />
      <ViewBankFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        selectedFilters={filteredBeneficiaries}
        onApplyFilter={function (filters: BeneficiaryType[]): void {
          setFilteredBeneficiaries(filters.filter(beneficiary => beneficiary.isChecked === true));
          setIsFilterVisible(true);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

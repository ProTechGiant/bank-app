import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import EmptySearchResult from "@/components/EmptySearchResult";
import FullScreenLoader from "@/components/FullScreenLoader";
import { SearchInput } from "@/components/Input";
import { LoadingErrorNotification } from "@/components/LoadingError";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { BeneficiaryList } from "@/features/InternalTransfers/components";
import { useBeneficiaries } from "@/features/InternalTransfers/hooks/query-hooks";
import { BeneficiaryType } from "@/features/InternalTransfers/types";
import { useThemeStyles } from "@/theme";
import { TransferBeneficiaryType } from "@/types/InternalTransfer";

function activeFilterCheck(beneficiaries: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
  return beneficiaries.filter(beneficiary => beneficiary.IVRValidated === isActive);
}
interface SelectBeneficiaryProps {
  onBeneficiaryPress: (user: BeneficiaryType) => void;
}

export default function SelectBeneficiary({ onBeneficiaryPress }: SelectBeneficiaryProps) {
  const { t } = useTranslation();

  const { data, refetch, isLoading, isError } = useBeneficiaries(TransferBeneficiaryType.ALL);
  const searchInputRef = useRef<TextInput>(null);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState<boolean>(false);

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
        beneficiary.Name?.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.IBAN?.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.BankAccountNumber?.toLocaleLowerCase().includes(lowerCaseQuery) ||
        beneficiary.BankName?.toLocaleLowerCase().includes(lowerCaseQuery)
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
    //TODO
  };

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const addIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
  }));

  return (
    <ContentContainer isScrollView>
      <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
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

        {isLoading ? (
          <FullScreenLoader />
        ) : filteredBeneficiaries.length > 0 ? (
          <Stack direction="vertical" gap="20p" align="stretch">
            {activeBeneficiaries.length > 0 ? (
              <BeneficiaryList
                beneficiaries={filteredBeneficiaries}
                onBeneficiaryPress={user => {
                  onBeneficiaryPress(user);
                }}
                testID="InternalTransfers.SendToBeneficiaryScreen:ActiveBeneficiaries"
              />
            ) : null}
          </Stack>
        ) : (
          <EmptySearchResult testID="InternalTransfers.SendToBeneficiaryScreen:EmptySearchResult" />
        )}
      </Stack>
      <LoadingErrorNotification
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
        onRefresh={() => refetch()}
      />
    </ContentContainer>
  );
}

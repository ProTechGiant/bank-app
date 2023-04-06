import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import BeneficiaryList from "../components/BeneficiaryList";
import BeneficiaryOptionsModal from "../components/BeneficiaryOptionsModal";
import SearchInput from "../components/SearchInput";
import { BeneficiaryType } from "../types";

const mockBeneficiaries: BeneficiaryType[] = [
  {
    id: 1,
    name: "Ahmed Abdul Aziz",
    bank: "Saudi National Bank",
    accountNumber: "1111 2222 3333 4444 5555 6666",
    isActive: true,
    lastUpdated: new Date("2030-11-23T00:00:00.000Z"),
  },
  {
    id: 2,
    name: "Last Name First",
    bank: "Bank",
    accountNumber: "1111 2222 3333 4444 5555 6661",
    isActive: true,
    lastUpdated: new Date("2030-11-22T00:00:00.000Z"),
  },
  {
    id: 3,
    name: "Last First",
    bank: "Bank Name",
    accountNumber: "1111 2222 3333 4444 5555 6662",
    isActive: true,
    lastUpdated: new Date("2030-11-21T00:00:00.000Z"),
  },
  {
    id: 4,
    name: "Bhmed Bbdul Bziz",
    bank: "Saudi National Bank",
    accountNumber: "1111 2222 3333 4444 5555 6663",
    isActive: false,
    lastUpdated: new Date("2031-11-20T00:00:00.000Z"),
  },
  {
    id: 5,
    name: "Last First",
    bank: "Bank Name",
    accountNumber: "1111 2222 3333 4444 5555 6664",
    isActive: false,
    lastUpdated: new Date("2030-11-21T00:00:00.000Z"),
  },
  {
    id: 6,
    name: "Last First",
    bank: "Bank Name",
    accountNumber: "1111 2222 3333 4444 5555 6665",
    isActive: false,
    lastUpdated: new Date("2030-11-22T00:00:00.000Z"),
  },
];

function activeFilterCheck(beneficiaries: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
  return beneficiaries
    .sort((a, b) => b.lastUpdated.valueOf() - a.lastUpdated.valueOf())
    .filter(beneficiary => beneficiary.isActive === isActive);
}

export default function SendToBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // temporary useState solution until Backend available
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryType[]>(mockBeneficiaries);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryType[]>(beneficiaries);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBeneficiary, setCurrentBeneficiary] = useState<BeneficiaryType>();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [isConfirmActivationModalVisible, setIsConfirmActivationModalVisible] = useState(false);

  const activeBeneficiaries = activeFilterCheck(filteredBeneficiaries, true);
  const inactiveBeneficiaries = activeFilterCheck(filteredBeneficiaries, false);

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = beneficiaries.filter(beneficiary => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        beneficiary.name.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.bank.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.accountNumber.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredBeneficiaries(searchResults);
  };

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setFilteredBeneficiaries(mockBeneficiaries);
  };

  const handleOnDelete = () => {
    // mocking what will happen when backend is implemented
    const updatedBeneficiaries = beneficiaries.filter(beneficiary => beneficiary.id !== currentBeneficiary?.id);
    setBeneficiaries(updatedBeneficiaries);
    setFilteredBeneficiaries(updatedBeneficiaries);
    setIsConfirmDeleteVisible(false);
    setIsMenuVisible(false);
  };

  const handleNavigateToAddBeneficiaries = () => {
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnActiveBeneficiaryPress = () => {
    navigation.navigate("InternalTransfers.ReviewTransferScreen");
  };

  const handleOnInactiveBeneficiaryPress = () => {
    setIsConfirmActivationModalVisible(true);
  };

  const handleOnMenuPress = (beneficiary: BeneficiaryType) => {
    setCurrentBeneficiary(beneficiary);
    setTimeout(() => {
      setIsMenuVisible(true);
    }, 100);
  };

  const handleOnCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleOnOpenDeleteConfirm = () => {
    setIsConfirmDeleteVisible(true);
  };

  const handleOnCloseConfirmDelete = () => {
    setIsMenuVisible(false);
    setIsConfirmDeleteVisible(false);
  };

  const handleOnConfirmActivation = () => {
    navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
    setIsConfirmActivationModalVisible(false);
  };

  const handleOnCloseConfirmActivation = () => {
    setIsConfirmActivationModalVisible(false);
  };

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const addIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 100,
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-50">
        <NavHeader />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          enabled>
          <ContentContainer isScrollView>
            <Stack direction="vertical" gap="24p" align="stretch" flex={1}>
              <Typography.Text size="title1" weight="semiBold">
                {t("InternalTransfers.SendToBeneficiaryScreen.title")}
              </Typography.Text>
              <SearchInput
                value={searchQuery}
                placeholder={t("InternalTransfers.SendToBeneficiaryScreen.search.placeholder")}
                onSearch={handleOnSearch}
                onClear={handleOnSearchClear}
                buttonText={t("InternalTransfers.SendToBeneficiaryScreen.search.button")}
              />
              <Pressable onPress={handleNavigateToAddBeneficiaries}>
                <Stack align="center" direction="horizontal" gap="12p">
                  <View style={addIconContainer}>
                    <PlusIcon color={iconColor} />
                  </View>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    {t("InternalTransfers.SendToBeneficiaryScreen.addNewBeneficiaryLink")}
                  </Typography.Text>
                </Stack>
              </Pressable>
              {filteredBeneficiaries.length > 0 ? (
                <Stack direction="vertical" gap="20p" align="stretch">
                  {activeBeneficiaries.length > 0 ? (
                    <>
                      <BeneficiaryList
                        title={t("InternalTransfers.SendToBeneficiaryScreen.confirmedBeneficiariesListTitle")}
                        beneficiaries={activeBeneficiaries}
                        onDelete={handleOnDelete}
                        onBeneficiaryPress={handleOnActiveBeneficiaryPress}
                        onMenuPress={handleOnMenuPress}
                      />
                    </>
                  ) : null}
                  {activeBeneficiaries.length > 0 && inactiveBeneficiaries.length > 0 ? (
                    <View style={separatorStyle}>
                      <Divider color="neutralBase-30" />
                    </View>
                  ) : null}
                  {inactiveBeneficiaries.length > 0 ? (
                    <BeneficiaryList
                      title={t("InternalTransfers.SendToBeneficiaryScreen.unconfirmedBeneficiariesListTitle")}
                      beneficiaries={inactiveBeneficiaries}
                      onDelete={handleOnDelete}
                      onBeneficiaryPress={handleOnInactiveBeneficiaryPress}
                      onMenuPress={handleOnMenuPress}
                    />
                  ) : null}
                </Stack>
              ) : (
                <View style={styles.noResults}>
                  <Typography.Text size="title3" weight="medium" align="center">
                    {t("InternalTransfers.SendToBeneficiaryScreen.search.emptyState.title")}
                  </Typography.Text>
                  <Typography.Text size="callout" align="center">
                    {t("InternalTransfers.SendToBeneficiaryScreen.search.emptyState.message")}
                  </Typography.Text>
                </View>
              )}
            </Stack>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      {currentBeneficiary ? (
        <BeneficiaryOptionsModal
          name={currentBeneficiary.name}
          isMenuVisible={isMenuVisible}
          isConfirmDeleteVisible={isConfirmDeleteVisible}
          onCloseMenu={handleOnCloseMenu}
          onOpenDeleteConfirm={handleOnOpenDeleteConfirm}
          onDelete={handleOnDelete}
          onCloseConfirmDelete={handleOnCloseConfirmDelete}
        />
      ) : null}
      <NotificationModal
        variant="confirmations"
        buttons={{
          primary: (
            <Button onPress={handleOnConfirmActivation}>
              {t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.confirmButton")}
            </Button>
          ),
          secondary: (
            <Button onPress={handleOnCloseConfirmActivation}>
              {t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.cancelButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.SendToBeneficiaryScreen.menu.deleteModal.message")}
        title={t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.title")}
        isVisible={isConfirmActivationModalVisible}
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
  noResults: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

import React, { useEffect, useMemo, useState } from "react";
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
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BeneficiaryList, BeneficiaryOptionsModal, SearchInput } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useBeneficiaries, useDeleteBeneficiary } from "../hooks/query-hooks";
import { BeneficiaryType, RecipientType } from "../types";

function activeFilterCheck(beneficiaries: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
  return beneficiaries.filter(beneficiary => beneficiary.IVRValidated === isActive);
}

export default function SendToBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { setRecipient } = useInternalTransferContext();
  const { data, refetch } = useBeneficiaries();
  const { mutateAsync } = useDeleteBeneficiary();
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBeneficiary, setCurrentBeneficiary] = useState<BeneficiaryType>();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [isConfirmActivationModalVisible, setIsConfirmActivationModalVisible] = useState(false);

  const beneficiaries = useMemo(
    () => (data !== undefined && data.Beneficiary !== undefined ? data.Beneficiary : []),
    [data]
  );

  const activeBeneficiaries = activeFilterCheck(filteredBeneficiaries, true);
  const inactiveBeneficiaries = activeFilterCheck(filteredBeneficiaries, false);

  useEffect(() => {
    setFilteredBeneficiaries(beneficiaries);
  }, [beneficiaries]);

  const handleOnSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = beneficiaries.filter(beneficiary => {
      const lowerCaseQuery = query.toLowerCase();
      const phoneNumber = beneficiary.PhoneNumber !== undefined ? beneficiary.PhoneNumber : "";
      const IBAN = beneficiary.PhoneNumber !== undefined ? beneficiary.PhoneNumber : "";
      return (
        beneficiary.Name.toLowerCase().includes(lowerCaseQuery) ||
        phoneNumber.toLowerCase().includes(lowerCaseQuery) ||
        IBAN.toLowerCase().includes(lowerCaseQuery) ||
        beneficiary.BankAccountNumber.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredBeneficiaries(searchResults);
  };

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setFilteredBeneficiaries(data !== undefined && data.Beneficiary !== undefined ? data.Beneficiary : []);
  };

  const handleOnDelete = async () => {
    if (currentBeneficiary) {
      try {
        await mutateAsync({
          name: currentBeneficiary.Name,
          accountNumber: currentBeneficiary.BankAccountNumber,
        });
        refetch();
      } catch (err) {
        warn("Beneficiary", "Could not process delete beneficiary: ", JSON.stringify(err));
      }
    } else {
      warn("Beneficiary", "No Beneficiary selected to delete");
    }
    setIsConfirmDeleteVisible(false);
    setIsMenuVisible(false);
  };

  const handleNavigateToAddBeneficiaries = () => {
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnBeneficiaryPress = (
    type: RecipientType,
    accountName: string,
    accountNumber: string,
    phoneNumber: string | undefined,
    iban: string | undefined
  ) => {
    setRecipient({
      accountName,
      accountNumber,
      phoneNumber,
      iban,
      type,
    });
    type === "active"
      ? navigation.navigate("InternalTransfers.ReviewTransferScreen")
      : setIsConfirmActivationModalVisible(true);
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
                        onBeneficiaryPress={(accountName, accountNumber, phoneNumber, iban) => {
                          handleOnBeneficiaryPress("active", accountName, accountNumber, phoneNumber, iban);
                        }}
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
                      onBeneficiaryPress={(accountName, accountNumber, phoneNumber, iban) => {
                        handleOnBeneficiaryPress("inactive", accountName, accountNumber, phoneNumber, iban);
                      }}
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
          name={currentBeneficiary.Name}
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
        message={t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.message")}
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

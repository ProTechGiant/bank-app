import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { PlusIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import { SearchInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { BeneficiaryList, BeneficiaryOptionsModal } from "../components";
import { useInternalTransferContext } from "../context/InternalTransfersContext";
import { useBeneficiaries, useBeneficiaryBanks, useDeleteBeneficiary } from "../hooks/query-hooks";
import { BeneficiaryType, RecipientType, TransferType } from "../types";

function activeFilterCheck(beneficiaries: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
  return beneficiaries.filter(beneficiary => beneficiary.IVRValidated === isActive);
}

export default function SendToBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { transferAmount, reason, setRecipient, transferType } = useInternalTransferContext();
  // BeneficiaryType is required in order to fetch the list of beneficiaries
  if (transferType === undefined) {
    throw new Error('Cannot access beneficiary list without "transferType"');
  }
  const { data, refetch } = useBeneficiaries(transferType);
  const { mutateAsync } = useDeleteBeneficiary();
  const bankList = useBeneficiaryBanks();

  const searchInputRef = useRef<TextInput>(null);
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
      const phoneNumber = beneficiary.PhoneNumber ?? "";
      const IBAN = beneficiary.IBAN ?? "";
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
    searchInputRef.current?.blur();
  };

  const handleOnDelete = async () => {
    if (currentBeneficiary) {
      try {
        await mutateAsync({
          BeneficiaryId: currentBeneficiary.BeneficiaryId,
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
    if (transferType === TransferType.SarieTransferAction) {
      navigation.navigate("InternalTransfers.StandardTransferNewBeneficiaryScreen");
    } else {
      navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
    }
  };

  const handleOnBeneficiaryPress = (
    type: RecipientType,
    accountName: string,
    accountNumber: string,
    phoneNumber: string | undefined,
    iban: string | undefined,
    bankName: string | undefined
  ) => {
    const selectedBank = bankList.data?.Banks.find(bankItem => bankItem.EnglishName === bankName);
    if (iban === undefined || transferAmount === undefined || reason === undefined) return;
    setRecipient({
      accountName,
      accountNumber,
      phoneNumber,
      iban,
      type,
      bankName,
    });
    type === "active"
      ? transferType === TransferType.SarieTransferAction
        ? navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
            PaymentAmount: transferAmount,
            ReasonCode: reason,
            Beneficiary: {
              FullName: accountName,
              SelectionValue: iban,
              IBAN: iban,
              Bank: selectedBank,
              type: type,
            },
          })
        : navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen")
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
      <Page backgroundColor="neutralBase-60">
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
                ref={searchInputRef}
                value={searchQuery}
                clearText={t("InternalTransfers.SendToBeneficiaryScreen.search.button")}
                placeholder={
                  transferType === TransferType.CroatiaToArbTransferAction
                    ? t("InternalTransfers.SendToBeneficiaryScreen.search.placeholderARB")
                    : t("InternalTransfers.SendToBeneficiaryScreen.search.placeholder")
                }
                onClear={handleOnSearchClear}
                onSearch={handleOnSearch}
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
                        transferType={transferType}
                        onBeneficiaryPress={(accountName, accountNumber, phoneNumber, iban, bankName) => {
                          handleOnBeneficiaryPress("active", accountName, accountNumber, phoneNumber, iban, bankName);
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
                      transferType={transferType}
                      onBeneficiaryPress={(accountName, accountNumber, phoneNumber, iban, bankName) => {
                        handleOnBeneficiaryPress("inactive", accountName, accountNumber, phoneNumber, iban, bankName);
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
        message={
          transferType === TransferType.SarieTransferAction
            ? t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.messageSarieTransfer")
            : t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.message")
        }
        title={
          transferType === TransferType.SarieTransferAction
            ? t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.titleSarieTransfer")
            : t("InternalTransfers.SendToBeneficiaryScreen.activateBeneficiary.title")
        }
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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from "react-native";

import { FullScreenIcon, PlusIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import EmptySearchResult from "@/components/EmptySearchResult";
import { SearchInput } from "@/components/Input";
import NotificationModal from "@/components/NotificationModal";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferBeneficiaryType, TransferType } from "@/types/InternalTransfer";

import { useBeneficiaries } from "../hooks/query-hooks";
import { BeneficiaryType } from "../types";
import BeneficiaryList from "./BeneficiaryList";

export default function BeneficiariesListWithSearchForTransfer() {
  const { t } = useTranslation();
  const { transferAmount, reason, transferType, setTransferType, setRecipient } = useInternalTransferContext();
  const navigation = useNavigation();

  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, isLoading, isError } = useBeneficiaries(
    transferType === TransferType.InternalTransferAction
      ? TransferBeneficiaryType.CROATIA
      : transferType === TransferType.CroatiaToArbTransferAction
      ? TransferBeneficiaryType.ARB
      : TransferBeneficiaryType.LOCAL
  );

  const beneficiaries = useMemo(
    () => (data !== undefined && data.Beneficiary !== undefined ? data.Beneficiary : []),
    [data]
  );

  useEffect(() => {
    setShowErrorModal(isError);
  }, [isError]);

  useEffect(() => {
    setFilteredBeneficiaries(beneficiaries);
  }, [beneficiaries]);

  const activeBeneficiaries = activeFilterCheck(filteredBeneficiaries, true);

  function activeFilterCheck(beneficiariesInput: BeneficiaryType[], isActive: boolean): BeneficiaryType[] {
    return beneficiariesInput.filter(beneficiariesParam => beneficiariesParam.Active === isActive);
  }

  const handleOnSearchClear = () => {
    setSearchQuery("");
    setFilteredBeneficiaries(beneficiaries);
  };

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

  const handleOnBeneficiaryPress = (user: BeneficiaryType) => {
    if (transferAmount === undefined || reason === undefined || transferType === undefined) return;

    if (
      transferType === TransferType.InternalTransferAction ||
      transferType === TransferType.CroatiaToArbTransferAction
    ) {
      setRecipient({
        accountName: user.Name ?? "",
        accountNumber: user.BankAccountNumber,
        iban: user.IBAN,
        type: user.Active ? "active" : "inactive",
        bankName:
          transferType === TransferType.InternalTransferAction
            ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.croatiaBank")
            : t("InternalTransfers.InternalTransferCTCAndCTAScreen.alrajhiBank"),
        beneficiaryId: user.BeneficiaryId,
        phoneNumber: user.PhoneNumber,
      });
      navigation.navigate("InternalTransfers.ReviewTransferScreen");
    } else {
      navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
        PaymentAmount: transferAmount,
        ReasonCode: reason,
        Beneficiary: {
          FullName: user.Name,
          IBAN: user.IBAN,
          type: transferType,
          beneficiaryId: user.BeneficiaryId,
          Bank: { EnglishName: user.BankName, ArabicName: user.BankArabicName },
        },
      });
    }
  };

  const handleNavigateToAddBeneficiaries = () => {
    switch (transferType) {
      case TransferType.InternalTransferAction:
        handleOnCroatiaBeneficiaryPress();
        break;

      case TransferType.CroatiaToArbTransferAction:
        handleOnAlrajhiBeneficiaryPress();
        break;
      // handle the third case.

      default:
        break;
    }
  };

  const handleOnCroatiaBeneficiaryPress = () => {
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnAlrajhiBeneficiaryPress = () => {
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const iconColor = useThemeStyles(theme => theme.palette.primaryBase);

  const addIconContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: 100,
  }));

  return (
    <View>
      <Stack direction="vertical" gap="32p">
        <SearchInput
          ref={searchInputRef}
          value={searchQuery}
          placeholder={t("InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent.searchPlaceholder")}
          onClear={handleOnSearchClear}
          onSearch={handleOnSearch}
          testID="InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent:SearchInput"
        />
        <Pressable
          onPress={handleNavigateToAddBeneficiaries}
          testID="InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent:AddBeneficiaryButton">
          <Stack align="center" direction="horizontal" gap="12p">
            <View style={addIconContainer}>
              <PlusIcon color={iconColor} />
            </View>
            <Typography.Text size="callout" weight="medium" color="neutralBase+30">
              {t("InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent.sendToANewBeneficiary")}
            </Typography.Text>
          </Stack>
        </Pressable>

        {isLoading ? (
          <FullScreenIcon />
        ) : filteredBeneficiaries.length > 0 ? (
          <Stack direction="vertical" gap="20p" align="stretch" style={styles.listContainer}>
            {activeBeneficiaries.length > 0 ? (
              <>
                <BeneficiaryList
                  beneficiaries={filteredBeneficiaries}
                  transferType={transferType}
                  onBeneficiaryPress={user => {
                    handleOnBeneficiaryPress(user);
                  }}
                  testID="InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent:ActiveBeneficiaries"
                />
              </>
            ) : null}
          </Stack>
        ) : (
          <EmptySearchResult testID="InternalTransfers.BeneficiaryListScreen.beneficiaryListComponent:EmptySearchResult" />
        )}
      </Stack>
      <NotificationModal
        onClose={() => {
          setShowErrorModal(false);
        }}
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={showErrorModal}
        variant="error"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
  },
});

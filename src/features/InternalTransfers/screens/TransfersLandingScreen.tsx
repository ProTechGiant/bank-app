import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, ScrollView, ViewStyle } from "react-native";

import { TransferSettingsIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import SelectTransferTypeModal from "@/components/SelectTransferTypeModal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCheckCustomerStatus, useGetDevices } from "@/features/SignIn/hooks/query-hooks";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useTransactions from "@/hooks/use-transactions";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";

import { FrequentBeneficiaries, TransactionCell, TransferActionButtons, TransferServices } from "../components";
import CountDownModel from "../components/CountDownModel";
import { useCheckPostRestriction, useFavouriteBeneficiaries } from "../hooks/query-hooks";
import { BeneficiaryType } from "../types";

export default function TransfersLandingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setTransferType, setIsReadOnly, setSignInTime, signInTime, isReadOnly, setBeneficiary } = useInternalTransferContext();
  const { userId } = useAuthContext();
  const { data } = useGetDevices();

  //TODO change api to get only transfer transactions in future
  const { transactions } = useTransactions();

  const { data: favouriteBeneficiaries } = useFavouriteBeneficiaries();

  const { data: accountData } = useCurrentAccount();
  const { isError: postRestrictionError } = useCheckPostRestriction(accountData?.id);
  const { mutateAsync: checkCustomerStatus } = useCheckCustomerStatus();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [isSelectTransferTypeVisible, setIsSelectTransferTypeVisible] = useState(false);
  const [isPostRestrictionModalVisible, setIsPostRestrictionModalVisible] = useState(false);
  const [isCountDownModalVisible, setIsCountDownModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const getCustomerStatus = async () => {
      try {
        const response = await checkCustomerStatus(userId);
        if (response.StatusId === 2) {
          setIsReadOnly(true);
          setSignInTime(data?.Devices.at(0)?.RegistrationDate.toString());
        } else {
          setIsReadOnly(false);
        }
      } catch (error) {}
    };

    getCustomerStatus();
  }, [checkCustomerStatus, userId]);

  const handleOnStartTransfer = (transferType: TransferType) => {
    if (postRestrictionError) {
      setIsPostRestrictionModalVisible(true);
      return;
    }

    switch (transferType) {
      case TransferType.InternalTransferAction:
        setTransferType(TransferType.InternalTransferAction);
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "InternalTransfers.InternalTransferScreen",
        });
        break;
      case TransferType.CroatiaToArbTransferAction:
        setTransferType(TransferType.CroatiaToArbTransferAction);
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "InternalTransfers.InternalTransferScreen",
        });
        break;
      case TransferType.IpsTransferAction:
        navigation.navigate("InternalTransfers.InternalTransfersStack", {
          screen: "InternalTransfers.QuickTransferScreen",
        });
        break;
    }
  };

  const handleNavigateToSettings = () => {
    navigation.navigate("InternalTransfers.InternalTransfersStack", {
      screen: "InternalTransfers.TransferSettingScreen",
    });
  };

  const handleOnBeneficiaryPress = (beneficiary: BeneficiaryType) => {
    setBeneficiary({
      FullName: beneficiary.Name,
      BankName: beneficiary.BankName,
      IBAN: beneficiary?.IBAN ?? "",
      beneficiaryId: beneficiary.BeneficiaryId,
      nickname: beneficiary?.Nickname ?? "",
      active: beneficiary.IVRValidated,
      type: beneficiary.BeneficiaryType,
      BeneficiaryType: beneficiary.BeneficiaryType,
      BankAccountNumber: beneficiary.BankAccountNumber,
      BankArabicName: beneficiary.BankArabicName,
    });
    navigation.navigate("InternalTransfers.BeneficiaryProfileScreen");
  };
  const handleOnAddNewBeneficiaryPress = () => {

    if (isReadOnly) {
      setIsCountDownModalVisible(true);
    } else {
      setIsSelectTransferTypeVisible(true);
    }
  };

  const handleOnCroatiaBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    setTransferType(TransferType.InternalTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnAlrajhiBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.EnterBeneficiaryDetailsScreen");
  };

  const handleOnLocalBeneficiaryPress = () => {
    setIsSelectTransferTypeVisible(false);
    setTransferType(TransferType.IpsTransferAction);
    navigation.navigate("InternalTransfers.QuickTransferScreen");
  };

  const handleOnCountDowndModalClose = () => {
    setIsCountDownModalVisible(false);
  };

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["20p"],
  }));
  const NavHeaderColor = useThemeStyles<string>(theme => theme.palette["neutralBase+30"]);
  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader
        variant="angled"
        backgroundAngledColor={NavHeaderColor}
        testID="InternalTransfers.TransfersLandingScreen:NavHeader"
        end={
          <Pressable onPress={handleNavigateToSettings} testID="AllInOneCard.CardControlScreen:Set">
            <TransferSettingsIcon />
          </Pressable>
        }>
        <NavHeader.BoldTitle color="neutralBase-60">
          {t("InternalTransfers.TransfersLandingScreen.title")}
        </NavHeader.BoldTitle>
      </NavHeader>
      <ScrollView contentContainerStyle={contentStyle}>
        <Stack direction="vertical" gap="32p" align="stretch">
          {/** Transfer quick actions */}
          <TransferActionButtons onStartTransfer={handleOnStartTransfer} />

          <TransferServices />

          <FrequentBeneficiaries
            beneficiaries={favouriteBeneficiaries ? favouriteBeneficiaries.Beneficiary : []}
            onPress={handleOnBeneficiaryPress}
            onAddNewBeneficiary={handleOnAddNewBeneficiaryPress}
          />

          <Stack direction="vertical" align="stretch" gap="12p">
            <Stack direction="horizontal" align="center" justify="space-between">
              <Typography.Text size="title3" weight="medium">
                {t("InternalTransfers.TransfersLandingScreen.Transactions.title")}
              </Typography.Text>
              <Pressable>
                <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
                  {t("InternalTransfers.TransfersLandingScreen.viewAll")}
                </Typography.Text>
              </Pressable>
            </Stack>

            {transactions.data?.Transaction?.length ? (
              <FlatList
                data={transactions.data.Transaction?.slice(0, 4)}
                renderItem={({ item }) => (
                  <TransactionCell
                    transaction={{
                      TransactionId: "",
                      BookingDateTime: item.BookingDateTime,
                      AccountId: item.AccountId,
                      AccountNumberMasked: "",
                      Amount: item.Amount,
                      CreditDebitIndicator: item.CreditDebitIndicator,
                      Status: item.Status,
                      beneficiaryName: "",
                    }}
                    onPress={() => {
                      return;
                    }}
                  />
                )}
                keyExtractor={(_item, index) => `key ${index}`}
                showsVerticalScrollIndicator={false}
              />
            ) : null}
          </Stack>
        </Stack>
      </ScrollView>
      <SelectTransferTypeModal
        isVisible={isSelectTransferTypeVisible}
        onCroatiaPress={handleOnCroatiaBeneficiaryPress}
        onAlrajhiPress={handleOnAlrajhiBeneficiaryPress}
        onLocalTransferPress={handleOnLocalBeneficiaryPress}
        onClose={() => setIsSelectTransferTypeVisible(false)}
        testID="InternalTransfers.TransfersLandingScreen:SelectTransferTypeModal"
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.TransfersLandingScreen.PostRestrictionErrorModal.title")}
        message={t("InternalTransfers.TransfersLandingScreen.PostRestrictionErrorModal.message")}
        isVisible={isPostRestrictionModalVisible}
        onClose={() => setIsPostRestrictionModalVisible(false)}
      />
      <CountDownModel
        title={t("InternalTransfers.DeviceControlModelScreen.restrictBeneficiaryAdditionTitle")}
        message={t("InternalTransfers.DeviceControlModelScreen.restrictActionMessage")}
        deviceSignInDate={signInTime}
        isVisible={isCountDownModalVisible}
        onClose={handleOnCountDowndModalClose}
        testID="InternalTransfers.DeviceControlModelScreen:BeneficiaryAdditionError"
      />
    </Page>
  );
}

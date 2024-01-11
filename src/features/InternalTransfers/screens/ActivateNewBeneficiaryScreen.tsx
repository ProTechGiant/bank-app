import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { parsePhoneNumber } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { BankAccountIcon, NicknameIcon, NumbersIcon, PersonFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { TransferType } from "@/types/InternalTransfer";
import { formatIban, makeMaskedName } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { ConfirmBeneficiaryListCard } from "../components";
import { useFocalBeneficiaryStatus } from "../hooks/query-hooks";
import { useBeneficiaryBanks } from "../hooks/query-hooks";

interface ConfirmBeneficiaryDeclarationForm {
  confirmBeneficiaryDeclaration: boolean;
}

const schema = yup.object({
  confirmBeneficiaryDeclaration: yup.boolean().isTrue(),
});

export default function ActivateNewBeneficiaryScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ActivateNewBeneficiaryScreen">>();
  const { isLocalBeneficiary } = route.params;
  const { transferAmount, reason, addBeneficiary, recipient, transferType } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isFocalCheckInProgress, setIsFocalCheckInProgress] = useState(true);
  const { mutateAsync: getBeneficiaryFocalStatus } = useFocalBeneficiaryStatus();
  const [isBeneficiaryFocalStatus, setBeneficiaryFocalStatus] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const { setValue } = useForm<ConfirmBeneficiaryDeclarationForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      confirmBeneficiaryDeclaration: false,
    },
  });

  useEffect(() => {
    //Adding this check because in case of CRO-ARB we dont have terms and condition check
    if (
      transferType === TransferType.CroatiaToArbTransferAction ||
      recipient.type === "active" ||
      transferType === TransferType.SarieTransferAction
    )
      setValue("confirmBeneficiaryDeclaration", true, { shouldValidate: true, shouldDirty: true });
  }, [setValue, transferType, recipient]);

  useEffect(() => {
    delayTransition(() => {
      handleOnSubmit(true);
    });
  }, []);

  const handleOnSubmit = async (justCheckFocal: boolean) => {
    if (transferType === TransferType.IpsTransferAction) {
      justCheckFocal && setIsFocalCheckInProgress(false);
      if (recipient.type === "inactive" || recipient.type === "new") {
        return !justCheckFocal && navigation.navigate("InternalTransfers.WaitingVerificationScreen");
      }
      !justCheckFocal &&
        navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
          PaymentAmount: transferAmount,
          ReasonCode: reason,
          selectionType: "ips_local_Beneficiary",
          Beneficiary: {
            FullName: route.params.Beneficiary.FullName,
            IBAN: route.params.Beneficiary.IBAN,
            type: route.params.Beneficiary.type,
            beneficiaryId: route.params.Beneficiary.beneficiaryId,
            Bank: {
              EnglishName: route.params.Beneficiary.Bank.EnglishName,
              ArabicName: route.params.Beneficiary.Bank.ArabicName,
              BankId: route.params.Beneficiary.Bank.BankId,
              BankCode: route.params.Beneficiary.Bank.BankCode,
              BankShortName: route.params.Beneficiary.Bank.BankShortName,
            },
          },
        });
      return;
    }

    if (!recipient.beneficiaryId) {
      warn("Focal check failure occurred", " BeneficiaryID not defined !");
      justCheckFocal && setIsFocalCheckInProgress(false);
      return;
    }

    justCheckFocal && setIsFocalCheckInProgress(true);
    try {
      const statusResponse = await getBeneficiaryFocalStatus({
        BeneficiaryId: isLocalBeneficiary ? route.params.Beneficiary.beneficiaryId : recipient.beneficiaryId || "",
      });
      justCheckFocal && setIsFocalCheckInProgress(false);
      // Status -> true means user is focal negative and good to go
      if (statusResponse?.Status?.toLowerCase() === "true") {
        if (recipient.type === "inactive" || recipient.type === "new") {
          return !justCheckFocal && navigation.navigate("InternalTransfers.WaitingVerificationScreen");
        } else if (transferType !== TransferType.SarieTransferAction) {
          return !justCheckFocal && navigation.navigate("InternalTransfers.ReviewTransferScreen");
        }

        const selectedBank = bankList.data?.Banks.find(item => item.EnglishName === recipient.bankName);
        if (
          transferAmount === undefined ||
          reason === undefined ||
          selectedBank === undefined ||
          recipient.accountName === undefined ||
          recipient.iban === undefined ||
          transferType === undefined
        ) {
          return;
        }

        !justCheckFocal &&
          navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
            PaymentAmount: transferAmount,
            ReasonCode: reason,
            selectionType: "ips_local_Beneficiary",
            Beneficiary: {
              FullName: recipient.accountName,
              IBAN: recipient.iban,
              Bank: selectedBank,
              type: recipient.type,
              beneficiaryId: recipient.beneficiaryId,
            },
          });
      } else {
        setIsGenericErrorModalVisible(false);
        delayTransition(() => {
          setBeneficiaryFocalStatus(true);
        });
      }
    } catch (error) {
      warn("focal-beneficiary-status", "Focal beneficiary status throwing error: ", JSON.stringify(error));
      setBeneficiaryFocalStatus(false);
      justCheckFocal && setIsFocalCheckInProgress(false);
      delayTransition(() => {
        setIsGenericErrorModalVisible(true);
      });
    }
  };

  const alertStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.extraSmall,
    marginTop: theme.spacing["24p"],
    borderColor: theme.palette["neutralBase-30"],
  }));
  const inputValue = isLocalBeneficiary ? route.params.Beneficiary.SelectionValue : "";
  const IBAN = isLocalBeneficiary ? inputValue : formatIban(recipient?.iban ?? "");
  const nickName = isLocalBeneficiary ? route.params.Beneficiary.nickname : recipient.nickname;
  const accountName = isLocalBeneficiary ? route.params.Beneficiary.FullName : recipient.accountName;
  const phoneNumber = isLocalBeneficiary ? inputValue : addBeneficiary?.SelectionValue;
  const accountNumber = isLocalBeneficiary ? inputValue : recipient.accountNumber;

  return (
    <>
      <Page backgroundColor="neutralBase-50">
        <NavHeader
          onBackPress={() => setShowCancelModal(true)}
          withBackButton
          title={t("InternalTransfers.ActivateNewBeneficiaryScreen.title")}
          end={<NavHeader.CloseEndButton onPress={() => setShowCancelModal(true)} />}
          testID="InternalTransfers.ActivateNewBeneficiaryScreen:NavHeader"
        />
        {isFocalCheckInProgress && (
          <View style={styles.loaderScreen}>
            <ActivityIndicator color={palette["neutralBase-50"]} size="small" />
          </View>
        )}
        <ContentContainer isScrollView style={styles.contentContainer}>
          <View>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.ActivateNewBeneficiaryScreen.Heading")}
            </Typography.Text>
            <Stack style={stackStyle} direction="vertical" align="stretch">
              {accountName && (
                <ConfirmBeneficiaryListCard
                  icon={<PersonFilledIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={
                    transferType !== TransferType.SarieTransferAction
                      ? t("InternalTransfers.ActivateNewBeneficiaryScreen.details.fullName")
                      : t("InternalTransfers.ActivateNewBeneficiaryScreen.details.fullName")
                  }
                  label={
                    transferType === TransferType.IpsTransferAction || transferType === TransferType.SarieTransferAction
                      ? makeMaskedName(accountName)
                      : accountName
                  }
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:AccountName"
                />
              )}
              {transferType === TransferType.CroatiaToArbTransferAction && (
                <ConfirmBeneficiaryListCard
                  icon={<BankAccountIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.bank")}
                  label={t("InternalTransfers.ActivateNewBeneficiaryScreen.bankName")}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:BankName"
                />
              )}
              {transferType === TransferType.InternalTransferAction && (
                <ConfirmBeneficiaryListCard
                  icon={<BankAccountIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.bank")}
                  label={t("InternalTransfers.ActivateNewBeneficiaryScreen.crotiabankName")}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:crotiabankName"
                />
              )}
              {transferType === TransferType.IpsTransferAction || transferType === TransferType.SarieTransferAction ? (
                <ConfirmBeneficiaryListCard
                  icon={<BankAccountIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.bank")}
                  label={
                    i18n.language === "en"
                      ? route.params?.Beneficiary?.Bank?.EnglishName
                      : route.params.Beneficiary?.Bank?.ArabicName
                  }
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:BankName"
                />
              ) : null}

              {route.params.selectedType === "IBAN" && (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.iban")}
                  label={IBAN}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:IbanNumber"
                />
              )}
              {route.params.selectedType === "nationalId" && (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.accountNumber")}
                  label={makeMaskedName(accountNumber || "")}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:AccountNumber"
                />
              )}

              {route.params.selectedType === "mobileNo" && (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.accountNumber")}
                  label={makeMaskedName(parsePhoneNumber(phoneNumber).format("INTERNATIONAL"))}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:PhoneNumber"
                />
              )}
              {route.params.selectedType === "accountId" && (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.accountNumber")}
                  label={makeMaskedName(accountNumber || "")}
                  testID="InternalTransfers.ActivateNewBeneficiaryScreen:AccountNumber"
                />
              )}
              <ConfirmBeneficiaryListCard
                isLastItem
                icon={<NicknameIcon color={palette["neutralBase-40"]} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ActivateNewBeneficiaryScreen.details.nickname")}
                label={nickName}
                testID="InternalTransfers.ActivateNewBeneficiaryScreen:Nickname"
              />
            </Stack>
          </View>

          <View>
            <View style={alertStyle}>
              <Alert
                variant="default"
                message={t("InternalTransfers.ActivateNewBeneficiaryScreen.bannerMessageActiveBeneficiary")}
              />
            </View>
            <Button
              onPress={() => handleOnSubmit(false)}
              testID="InternalTransfers.ActivateNewBeneficiaryScreen:ConfirmButton">
              {t("InternalTransfers.ActivateNewBeneficiaryScreen.confirmButton")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="warning"
        testID="InternalTransfers.ActivateNewBeneficiaryScreen:cancelModal"
        title={t("InternalTransfers.ActivateNewBeneficiaryScreen.cancelModal.title")}
        isVisible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        buttons={{
          primary: (
            <Button
              testID="InternalTransfers.ActivateNewBeneficiaryScreen:buttonYes"
              onPress={() => navigation.goBack()}>
              {t("InternalTransfers.ActivateNewBeneficiaryScreen.cancelModal.buttonYes")}
            </Button>
          ),
          secondary: (
            <Button
              testID="InternalTransfers.ActivateNewBeneficiaryScreen:buttonNo"
              onPress={() => setShowCancelModal(false)}>
              {t("InternalTransfers.ActivateNewBeneficiaryScreen.cancelModal.buttonNo")}
            </Button>
          ),
        }}
      />
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => setIsGenericErrorModalVisible(false)}
        testID="InternalTransfers.ActivateNewBeneficiaryScreen:ActivateNewBeneficiaryErrorModal"
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ActivateNewBeneficiaryScreen.focalBeneficiaryError.title")}
        message={t("InternalTransfers.ActivateNewBeneficiaryScreen.focalBeneficiaryError.message")}
        isVisible={isBeneficiaryFocalStatus}
        onClose={() => setBeneficiaryFocalStatus(false)}
        testID="InternalTransfers.ActivateNewBeneficiaryScreen:FocalBeneficiaryErrorModal"
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
  loaderScreen: {
    backgroundColor: palette["neutralBase+30"],
    bottom: 0,
    justifyContent: "center",
    left: 0,
    opacity: 0.6,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
});

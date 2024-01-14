import { yupResolver } from "@hookform/resolvers/yup";
import { parsePhoneNumber } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { BankAccountIcon, NicknameIcon, NumbersIcon, PersonFilledIcon, PhoneFilledIcon } from "@/assets/icons";
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
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { TransferType } from "@/types/InternalTransfer";
import { formatIban, makeMaskedName } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { ConfirmBeneficiaryListCard } from "../components";
import { useFocalBeneficiaryStatus } from "../hooks/query-hooks";
import { useBeneficiaryBanks } from "../hooks/query-hooks";
import { IVREntryPoint } from "../types";

interface ConfirmBeneficiaryDeclarationForm {
  confirmBeneficiaryDeclaration: boolean;
}

const schema = yup.object({
  confirmBeneficiaryDeclaration: yup.boolean().isTrue(),
});

export default function ConfirmNewBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { transferAmount, reason, addBeneficiary, recipient, transferType } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();

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

  const errorModalDismiss = () => {
    setBeneficiaryFocalStatus(false);
    setIsGenericErrorModalVisible(false);
  };

  const handleOnSubmit = async () => {
    try {
      const statusResponse = await getBeneficiaryFocalStatus({
        BeneficiaryId: recipient.beneficiaryId || "",
      });
      if (statusResponse?.Status?.toLowerCase() === "true") {
        if (recipient.type === "inactive" || recipient.type === "new") {
          return  navigation.navigate("InternalTransfers.WaitingVerificationScreen", {
            navigationFlow: IVREntryPoint.TransferFlow,
        });
        } else if (transferType !== TransferType.SarieTransferAction) {
          return navigation.navigate("InternalTransfers.ReviewTransferScreen");
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

        navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", {
          PaymentAmount: transferAmount,
          selectionType: "ips_local_Beneficiary",
          ReasonCode: reason,
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

  return (
    <>
      <Page backgroundColor="neutralBase-50">
        <NavHeader
          onBackPress={() => setShowCancelModal(true)}
          withBackButton
          title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.navTitle")}
          testID="InternalTransfers.ConfirmNewBeneficiaryScreen:NavHeader"
        />
        <ContentContainer isScrollView style={styles.contentContainer}>
          <View>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.title")}
            </Typography.Text>
            <Stack style={stackStyle} direction="vertical" align="stretch">
              {recipient.accountName !== undefined ? (
                <ConfirmBeneficiaryListCard
                  icon={<PersonFilledIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={
                    transferType === TransferType.SarieTransferAction
                      ? t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.fullName")
                      : t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.fullName")
                  }
                  label={
                    transferType === TransferType.IpsTransferAction || transferType === TransferType.SarieTransferAction
                      ? makeMaskedName(recipient.accountName)
                      : recipient.accountName
                  }
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:AccountName"
                />
              ) : null}
              {transferType === TransferType.CroatiaToArbTransferAction ||
              transferType === TransferType.SarieTransferAction ? (
                <ConfirmBeneficiaryListCard
                  icon={<BankAccountIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.bank")}
                  label={t("InternalTransfers.ConfirmNewBeneficiaryScreen.bankName")}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:BankName"
                />
              ) : transferType === TransferType.InternalTransferAction ? (
                <ConfirmBeneficiaryListCard
                  icon={<BankAccountIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.bank")}
                  label={t("InternalTransfers.ConfirmNewBeneficiaryScreen.crotiabankName")}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:crotiabankName"
                />
              ) : null}
              {recipient.accountNumber !== undefined &&
              transferType !== TransferType.SarieTransferAction &&
              addBeneficiary?.SelectionType === "accountId" ? (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.accountNumber")}
                  label={recipient.accountNumber}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:AccountNumber"
                />
              ) : null}
              {recipient.type === "new" &&
              addBeneficiary?.SelectionType === "mobileNo" &&
              transferType !== TransferType.SarieTransferAction ? (
                <ConfirmBeneficiaryListCard
                  icon={<PhoneFilledIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.mobile")}
                  label={parsePhoneNumber(addBeneficiary.SelectionValue).format("INTERNATIONAL")}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:PhoneNumber"
                />
              ) : (recipient.type === "new" && addBeneficiary?.SelectionType === "IBAN") ||
                (transferType !== TransferType.SarieTransferAction &&
                  addBeneficiary?.SelectionValue &&
                  addBeneficiary?.SelectionType === "IBAN" &&
                  recipient.type !== "active" &&
                  recipient.type !== "inactive") ? (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
                  label={formatIban(recipient?.iban ?? "")}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:IbanNumber"
                />
              ) : null}
              {recipient.type === "inactive" &&
              recipient.phoneNumber !== undefined &&
              addBeneficiary?.SelectionType === "mobileNo" &&
              transferType !== TransferType.SarieTransferAction ? (
                transferType !== TransferType.CroatiaToArbTransferAction ? (
                  <ConfirmBeneficiaryListCard
                    icon={<PhoneFilledIcon color={iconColor} />}
                    iconBackground="neutralBase-40"
                    caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.mobile")}
                    label={recipient.phoneNumber}
                    testID="InternalTransfers.ConfirmNewBeneficiaryScreen:PhoneNumber"
                  />
                ) : null
              ) : recipient.type === "inactive" &&
                addBeneficiary?.SelectionType === "IBAN" &&
                recipient.iban !== undefined ? (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
                  label={formatIban(recipient.iban || "")}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:IbanNumber"
                />
              ) : null}
              {recipient.type === "active" && recipient.iban !== undefined ? (
                <ConfirmBeneficiaryListCard
                  icon={<NumbersIcon color={iconColor} />}
                  iconBackground="neutralBase-40"
                  caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
                  label={formatIban(recipient.iban)}
                  testID="InternalTransfers.ConfirmNewBeneficiaryScreen:IbanNumber"
                />
              ) : null}
              <ConfirmBeneficiaryListCard
                isLastItem
                icon={<NicknameIcon color={palette["neutralBase-40"]} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.nickname")}
                label={recipient.accountName || ""}
                testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:Nickname"
              />
            </Stack>
          </View>

          <View>
            <View style={alertStyle}>
              <Alert
                variant="default"
                message={
                  recipient.type === "active" &&
                  (transferType === TransferType.CroatiaToArbTransferAction ||
                    transferType === TransferType.InternalTransferAction)
                    ? t("InternalTransfers.ConfirmNewBeneficiaryScreen.bannerMessageActiveBeneficiary")
                    : t("InternalTransfers.ConfirmNewBeneficiaryScreen.bannerMessage")
                }
              />
            </View>
            <Button onPress={handleOnSubmit} testID="InternalTransfers.ConfirmNewBeneficiaryScreen:ConfirmButton">
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.confirmButton")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        testID="InternalTransfers.ConfirmNewBeneficiaryScreen:cancelModal"
        title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.cancelModal.title")}
        isVisible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        buttons={{
          primary: (
            <Button
              testID="InternalTransfers.ConfirmNewBeneficiaryScreen:buttonYes"
              onPress={() => navigation.goBack()}>
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.cancelModal.buttonYes")}
            </Button>
          ),
          secondary: (
            <Button
              testID="InternalTransfers.ConfirmNewBeneficiaryScreen:buttonNo"
              onPress={() => setShowCancelModal(false)}>
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.cancelModal.buttonNo")}
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
        buttons={{
          primary: <Button onPress={errorModalDismiss}>{t("errors.generic.button")}</Button>,
        }}
        testID="InternalTransfers.ConfirmNewBeneficiaryScreen:ConfirmBeneficiaryErrorModal"
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.title")}
        message={t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.message")}
        isVisible={isBeneficiaryFocalStatus}
        onClose={() => setBeneficiaryFocalStatus(false)}
        buttons={{
          primary: (
            <Button onPress={errorModalDismiss}>
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.ok")}
            </Button>
          ),
        }}
        testID="InternalTransfers.ConfirmNewBeneficiaryScreen:FocalBeneficiaryErrorModal"
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});

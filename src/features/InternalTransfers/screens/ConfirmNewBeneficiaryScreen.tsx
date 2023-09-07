import { yupResolver } from "@hookform/resolvers/yup";
import { parsePhoneNumber } from "libphonenumber-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { BankAccountIcon, NumbersIcon, PersonFilledIcon, PhoneFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import CheckboxInput from "@/components/Form/CheckboxInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { formatIban } from "@/utils";

import { ConfirmBeneficiaryListCard } from "../components";
import { useBeneficiaryBanks } from "../hooks/query-hooks";

interface ConfirmBeneficiaryDeclarationForm {
  confirmBeneficiaryDeclaration: boolean;
}

const schema = yup.object({
  confirmBeneficiaryDeclaration: yup.boolean().isTrue(),
});

export default function ConfirmNewBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { transferAmount, reason, addBeneficiary, recipient, transferType } = useInternalTransferContext();
  const bankList = useBeneficiaryBanks();

  const { control, handleSubmit, setValue } = useForm<ConfirmBeneficiaryDeclarationForm>({
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

  const handleOnPressTermsAndConditions = () => {
    navigation.navigate("InternalTransfers.BeneficiaryDeclarationModal");
  };

  const handleOnSubmit = () => {
    if (recipient.type === "inactive" || recipient.type === "new") {
      return navigation.navigate("InternalTransfers.WaitingVerificationScreen");
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
      ReasonCode: reason,
      Beneficiary: {
        FullName: recipient.accountName,
        IBAN: recipient.iban,
        Bank: selectedBank,
        type: recipient.type,
      },
    });
  };

  const checkBoxStackStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "flex-end",
    marginHorizontal: theme.spacing["12p"],
    paddingBottom: theme.spacing["20p"],
    paddingTop: theme.spacing["12p"],
  }));

  const checkBoxTextStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingStart: theme.spacing["8p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader withBackButton title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.navTitle")} />
      <ContentContainer isScrollView style={styles.contentContainer}>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
            {t("InternalTransfers.ConfirmNewBeneficiaryScreen.title")}
          </Typography.Text>
          {recipient.accountName !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<PersonFilledIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={
                transferType === TransferType.SarieTransferAction
                  ? t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.fullName")
                  : t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.name")
              }
              label={recipient.accountName}
            />
          ) : null}
          {transferType === TransferType.CroatiaToArbTransferAction ||
          transferType === TransferType.SarieTransferAction ? (
            <ConfirmBeneficiaryListCard
              icon={<BankAccountIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.bank")}
              label={t("InternalTransfers.ConfirmNewBeneficiaryScreen.bankName")}
            />
          ) : null}
          {recipient.accountNumber !== undefined && transferType !== TransferType.SarieTransferAction ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.accountNumber")}
              label={recipient.accountNumber}
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
            />
          ) : (recipient.type === "new" && addBeneficiary?.SelectionType === "IBAN") ||
            (transferType !== TransferType.SarieTransferAction && addBeneficiary?.SelectionValue) ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
              label={formatIban(addBeneficiary?.SelectionValue ?? "")}
            />
          ) : null}
          {recipient.type === "inactive" &&
          recipient.phoneNumber !== undefined &&
          transferType !== TransferType.SarieTransferAction ? (
            transferType !== TransferType.CroatiaToArbTransferAction ? (
              <ConfirmBeneficiaryListCard
                icon={<PhoneFilledIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.mobile")}
                label={recipient.phoneNumber}
              />
            ) : null
          ) : recipient.type === "inactive" && recipient.iban !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
              label={formatIban(recipient.iban)}
            />
          ) : null}
          {recipient.type === "active" && recipient.iban !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmNewBeneficiaryScreen.details.iban")}
              label={formatIban(recipient.iban)}
            />
          ) : null}
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
        </Stack>
        <View>
          {!(
            transferType === TransferType.CroatiaToArbTransferAction ||
            recipient.type === "active" ||
            transferType === TransferType.SarieTransferAction
          ) ? (
            <View>
              <View style={dividerStyle}>
                <Divider color="neutralBase-30" />
              </View>
              <Stack direction="horizontal" style={checkBoxStackStyle}>
                <CheckboxInput control={control} isEditable={true} name="confirmBeneficiaryDeclaration" />
                <View style={checkBoxTextStyle}>
                  <Typography.Text size="footnote" weight="medium" color="neutralBase">
                    {t("InternalTransfers.ConfirmNewBeneficiaryScreen.checkBoxMessage")}
                    <Typography.Text
                      size="footnote"
                      weight="medium"
                      color="primaryBase-40"
                      onPress={handleOnPressTermsAndConditions}>
                      {t("InternalTransfers.ConfirmNewBeneficiaryScreen.termsAndConditions")}
                    </Typography.Text>
                  </Typography.Text>
                </View>
              </Stack>
            </View>
          ) : null}
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("InternalTransfers.ConfirmNewBeneficiaryScreen.confirmButton")}
          </SubmitButton>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});

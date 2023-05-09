import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { BankAccountIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { saudiPhoneRegExp } from "@/utils";
import { ibanRegExp } from "@/utils";

import { useBeneficiaryBanks } from "../hooks/query-hooks";

interface BeneficiaryInput {
  bankId: string;
  email?: string;
  iban?: string;
  identifier?: string;
  name?: string;
  phoneNumber?: string;
  transferMethod: "mobile" | "email" | "id" | "iban";
}

export default function EnterQuickTransferBeneficiaryScreen() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const banks = useBeneficiaryBanks();
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        bankId: yup.string().required(),
        email: yup
          .string()
          .email(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.validation.invalid"))
          .when("transferMethod", {
            is: "email",
            then: yup
              .string()
              .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.validation.required")),
          }),
        iban: yup.string().when("transferMethod", {
          is: "iban",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.validation.required"))
            .length(24, t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.validation.lengthInvalid"))
            .matches(
              ibanRegExp,
              t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.validation.formatInvalid")
            ),
        }),
        identifier: yup.string().when("transferMethod", {
          is: "id",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.id.validation.required"))
            .length(10, t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.id.validation.invalid")),
        }),
        name: yup.string().when("transferMethod", {
          is: "iban",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.validation.required")),
        }),
        phoneNumber: yup.string().when("transferMethod", {
          is: "mobile",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.validation.required"))
            .matches(
              saudiPhoneRegExp,
              t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.validation.invalid")
            ),
        }),
      }),
    [i18n.language]
  );

  const { control, handleSubmit, setValue, watch } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      bankId: undefined,
      transferMethod: "mobile",
    },
  });

  const [isBanksLoadingErrorVisible, setIsBanksLoadingErrorVisible] = useState(false);
  // !TODO: AC11
  const [isNotSupportingQuickTransferErrorVisible, setIsNotSupportingQuickTransferErrorVisible] = useState(false);
  // !TODO: AC19
  const [isQuickTransferErrorVisible, setIsQuickTransferErrorVisible] = useState(false);

  useEffect(() => {
    setIsBanksLoadingErrorVisible(banks.isError);
  }, [banks.isError]);

  const handleOnSubmit = (_values: BeneficiaryInput) => {
    // !TODO: AC9, AC10
    navigation.navigate("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen");
  };

  const identifiers = [
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.mobile"), value: "mobile" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.email"), value: "email" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.id"), value: "id" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.iban"), value: "iban" },
  ] as const;

  const transferMethod = watch("transferMethod");
  const bankId = watch("bankId");

  const bankOptions = useMemo(() => {
    if (banks.data === undefined) return [];

    return banks.data.Banks.map(element => ({
      label: element.EnglishName,
      value: element.BankId,
      icon: <AccountBalanceIcon />,
    }));
  }, [banks.data]);

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.navTitle")} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView style={styles.container}>
            <Stack align="stretch" direction="vertical" gap="20p">
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.title")}
              </Typography.Text>
              <DropdownInput
                autoselect={false}
                buttonLabel={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankConfirm")}
                control={control}
                isFixedHeight
                name="bankId"
                headerText={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankHeaderText")}
                options={bankOptions}
                label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankLabel")}
              />
              <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferBy")}
              </Typography.Text>
              <Stack direction="horizontal" gap="8p">
                {identifiers.map(element => (
                  <Pill
                    key={element.value}
                    isActive={transferMethod === element.value}
                    onPress={() => setValue("transferMethod", element.value, { shouldValidate: true })}>
                    {element.label}
                  </Pill>
                ))}
              </Stack>
              {transferMethod === "mobile" ? (
                <PhoneNumberInput
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.label")}
                  maxLength={9}
                  name="phoneNumber"
                  showCharacterCount
                />
              ) : transferMethod === "email" ? (
                <TextInput
                  autoComplete="email"
                  autoCapitalize="none"
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.label")}
                  name="email"
                  placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.placeholder")}
                />
              ) : transferMethod === "id" ? (
                <MaskedTextInput
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.id.label")}
                  keyboardType="number-pad"
                  maxLength={10}
                  mask="##########"
                  name="identifier"
                  placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.id.placeholder")}
                  showCharacterCount
                />
              ) : (
                <Stack align="stretch" direction="vertical" gap="20p">
                  <TextInput
                    control={control}
                    label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.fullNameLabel")}
                    name="name"
                    placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.fullNamePlacholder")}
                  />
                  <MaskedTextInput
                    autoCapitalize="characters"
                    control={control}
                    label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.ibanLabel")}
                    name="iban"
                    maxLength={24}
                    showCharacterCount
                    mask={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.ibanPlaceholder")}
                    placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.ibanPlaceholder")}
                  />
                </Stack>
              )}
            </Stack>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.continue")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsBanksLoadingErrorVisible(false);
          setTimeout(() => navigation.goBack(), 300);
        }}
        message={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBanksError.message")}
        title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBanksError.title")}
        isVisible={isBanksLoadingErrorVisible}
        variant="error"
      />
      {bankId !== undefined ? (
        <NotificationModal
          onClose={() => setIsNotSupportingQuickTransferErrorVisible(false)}
          message={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.quickTransfersUnsupportedError.message", {
            bankName: bankOptions.find(element => element.value === bankId)?.label ?? "unknown",
          })}
          title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.quickTransfersUnsupportedError.title")}
          isVisible={isNotSupportingQuickTransferErrorVisible}
          variant="error"
        />
      ) : null}
      <NotificationModal
        onClose={() => {
          setIsQuickTransferErrorVisible(false);
          setTimeout(() => navigation.goBack(), 300);
        }}
        message={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.validationError.message")}
        title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.validationError.title")}
        isVisible={isQuickTransferErrorVisible}
        variant="error"
      />
    </>
  );
}

function AccountBalanceIcon() {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    justifyContent: "center",
    height: 36,
    width: 36,
  }));

  return (
    <View style={containerStyle}>
      <BankAccountIcon color="#2E2E2E" height={16} width={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  keyboard: {
    flex: 1,
  },
});

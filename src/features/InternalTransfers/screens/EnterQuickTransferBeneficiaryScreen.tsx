import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import { BankAccountIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { Masks } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { ALRAJHI_BANK_CODE } from "@/constants";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { ibanRegExp, ibanRegExpForARB, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { SwitchToARBModal } from "../components";
import { useBeneficiaryBanks, useValidateQuickTransferBeneficiary } from "../hooks/query-hooks";

interface BeneficiaryInput {
  bankCode: string;
  email?: string;
  iban?: string;
  identifier?: string;
  name?: string;
  phoneNumber?: string;
  transferMethod: "mobileNo" | "nationalId" | "IBAN" | "email";
}

export default function EnterQuickTransferBeneficiaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { setTransferType, transferAmount, reason } = useInternalTransferContext();

  const banks = useBeneficiaryBanks();
  const validateBeneficiaryAsync = useValidateQuickTransferBeneficiary();

  const [isSwitchToARBModalVisible, setIsSwitchToARBModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        bankCode: yup.string().required(),
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
          is: "IBAN",
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
          is: "nationalId",
          then: yup
            .string()
            .matches(
              numericRegExp,
              t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.nationalID.validation.invalid")
            )
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.nationalID.validation.required"))
            .length(10, t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.nationalID.validation.invalid")),
        }),
        name: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.validation.required")),
        }),
        phoneNumber: yup.string().when("transferMethod", {
          is: "mobileNo",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.validation.required"))
            .matches(
              saudiPhoneRegExp,
              t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.validation.invalid")
            ),
        }),
      }),
    [t]
  );

  const { control, handleSubmit, setValue, watch, getValues } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      bankCode: undefined,
      transferMethod: "mobileNo",
    },
  });

  const [isBanksLoadingErrorVisible, setIsBanksLoadingErrorVisible] = useState(false);
  const [isNotSupportingQuickTransferErrorVisible, setIsNotSupportingQuickTransferErrorVisible] = useState(false);
  const [isQuickTransferErrorVisible, setIsQuickTransferErrorVisible] = useState(false);
  const [isQuickTransferValidationErrorVisible, setIsQuickTransferValidationErrorVisible] = useState(false);
  const [i18nKey, setI18nKey] = useState<"email" | "mobile" | "nationalID" | "iban">();

  useEffect(() => {
    setIsBanksLoadingErrorVisible(banks.isError);
  }, [banks.isError]);

  const handleOnSubmit = async (_values: BeneficiaryInput) => {
    Keyboard.dismiss();

    const selectionValue =
      _values.transferMethod === "email"
        ? _values.email
        : _values.transferMethod === "IBAN"
        ? _values.iban
        : _values.transferMethod === "nationalId"
        ? _values.identifier
        : _values.transferMethod === "mobileNo"
        ? _values.phoneNumber
        : undefined;

    //Adding this to check if IBAN is of ARB, because we are specifically told to add this on frontend.
    if (_values.transferMethod === "IBAN" && selectionValue && selectionValue.match(ibanRegExpForARB)) {
      setIsSwitchToARBModalVisible(true);
      return;
    }

    const selectedBank = banks.data?.Banks.find(bank => bank.BankCode === _values.bankCode);
    if (selectionValue === undefined || selectedBank === undefined) return;

    try {
      const response = await validateBeneficiaryAsync.mutateAsync({
        SelectionType: _values.transferMethod,
        SelectionValue: selectionValue,
        bank: selectedBank,
        name: _values.name,
      });

      navigation.navigate("InternalTransfers.ConfirmLocalTransferBeneficiaryScreen", {
        PaymentAmount: transferAmount ?? 0,
        ReasonCode: reason ?? "",
        Beneficiary: {
          FullName: response.AccountName,
          Bank: response.Bank,
          SelectionType: _values.transferMethod,
          SelectionValue: selectionValue,
          IBAN: response.AccountIban,
          beneficiaryId: response.AdhocBeneficiaryId,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_DOESNOT_SUPPORT)) {
          setIsNotSupportingQuickTransferErrorVisible(true);
        } else if (error.errorContent.Message.includes(ERROR_EMAIL_INVALID)) {
          setI18nKey("email");
          setIsQuickTransferValidationErrorVisible(true);
        } else if (error.errorContent.Message.includes(ERROR_PHONE_NUMBER_INVALID)) {
          setI18nKey("mobile");
          setIsQuickTransferValidationErrorVisible(true);
        } else if (error.errorContent.Message.includes(ERROR_NATIONAL_ID_NOT_EXIST)) {
          setI18nKey("nationalID");
          setIsQuickTransferValidationErrorVisible(true);
        } else if (error.errorContent.Message.includes(ERROR_IBAN_NOT_VALID)) {
          setI18nKey("iban");
          setIsQuickTransferValidationErrorVisible(true);
        } else {
          setIsQuickTransferErrorVisible(true);
        }
      } else {
        setIsQuickTransferErrorVisible(true);
      }
      warn("Validate Beneficiary", "Could not validate beneficiary: ", JSON.stringify(error));
    }
  };

  const handleOnSwitchToARB = () => {
    setIsSwitchToARBModalVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleOnCancel = () => {
    setIsSwitchToARBModalVisible(false);
    setValue("bankCode", "", { shouldValidate: true });
  };

  const handleErrorModal = () => {
    setIsQuickTransferErrorVisible(false);
    delayTransition(() => navigation.goBack());
  };

  const identifiers = [
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.mobile"), value: "mobileNo" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.email"), value: "email" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.id"), value: "nationalId" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.iban"), value: "IBAN" },
  ] as const;

  const transferMethod = watch("transferMethod");
  const bankCode = watch("bankCode");

  useEffect(() => {
    if (bankCode === ALRAJHI_BANK_CODE) {
      delayTransition(() => {
        setIsSwitchToARBModalVisible(true);
      });
    }
  }, [bankCode]);

  const bankOptions = useMemo(() => {
    if (banks.data === undefined) return [];

    return banks.data.Banks.map(element => ({
      label: element.EnglishName,
      value: element.BankCode,
      icon: <AccountBalanceIcon />,
    }));
  }, [banks.data]);

  const formContainerStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.navTitle")}
          testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:NavHeader"
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView keyboardShouldPersistTaps="always" style={styles.container}>
            <Stack align="stretch" direction="vertical" gap="20p" style={formContainerStyle}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.title")}
              </Typography.Text>
              <DropdownInput
                autoselect={false}
                buttonLabel={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankConfirm")}
                control={control}
                isFixedHeight
                name="bankCode"
                headerText={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankHeaderText")}
                options={bankOptions}
                label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBankLabel")}
                testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:BeneficiaryBankDropdown"
              />
              <Typography.Text color="neutralBase+30" size="title3" weight="medium">
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferBy")}
              </Typography.Text>
              <Stack direction="horizontal" gap="8p">
                {identifiers.map(element => (
                  <Pill
                    testID={`InternalTransfers.EnterQuickTransferBeneficiaryScreen:TransferMethodPill-${element.value}`}
                    key={element.value}
                    isActive={transferMethod === element.value}
                    onPress={() => setValue("transferMethod", element.value, { shouldValidate: true })}>
                    {element.label}
                  </Pill>
                ))}
              </Stack>
              {transferMethod === "mobileNo" ? (
                <PhoneNumberInput
                  value={getValues("phoneNumber")}
                  onClear={() => {
                    setValue("phoneNumber", "");
                  }}
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.mobile.label")}
                  name="phoneNumber"
                  testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:PhoneNumberInput"
                />
              ) : transferMethod === "email" ? (
                <TextInput
                  value={getValues("email")}
                  onClear={() => {
                    setValue("email", "");
                  }}
                  autoComplete="email"
                  autoCapitalize="none"
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.label")}
                  name="email"
                  placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.email.placeholder")}
                  testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:EmailInput"
                />
              ) : transferMethod === "nationalId" ? (
                <MaskedTextInput
                  onClear={() => {
                    setValue("identifier", "");
                  }}
                  value={getValues("identifier")}
                  control={control}
                  label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.nationalID.label")}
                  keyboardType="number-pad"
                  mask={Masks.NATIONAL_ID}
                  name="identifier"
                  testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:NationalIDInput"
                />
              ) : (
                <Stack align="stretch" direction="vertical" gap="20p">
                  <TextInput
                    value={getValues("name")}
                    onClear={() => {
                      setValue("name", "");
                    }}
                    control={control}
                    label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.fullNameLabel")}
                    name="name"
                    placeholder={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.fullNamePlacholder")}
                    testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:FullNameInput"
                  />
                  <MaskedTextInput
                    value={getValues("iban")}
                    onClear={() => {
                      setValue("iban", "");
                    }}
                    autoCapitalize="characters"
                    control={control}
                    label={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.iban.ibanLabel")}
                    name="iban"
                    mask={Masks.IBAN}
                    testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:IBANInput"
                  />
                </Stack>
              )}
            </Stack>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:ContinueButton">
              {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.continue")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsBanksLoadingErrorVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        message={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBanksError.message")}
        title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.beneficiaryBanksError.title")}
        isVisible={isBanksLoadingErrorVisible}
        variant="error"
        testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:BeneficiaryBanksErrorModal"
      />
      {bankCode !== undefined ? (
        <NotificationModal
          onClose={() => setIsNotSupportingQuickTransferErrorVisible(false)}
          message={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.quickTransfersUnsupportedError.message", {
            bankName: bankOptions.find(element => element.value === bankCode)?.label ?? "unknown",
          })}
          title={t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.quickTransfersUnsupportedError.title")}
          isVisible={isNotSupportingQuickTransferErrorVisible}
          variant="error"
          testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:QuickTransfersUnsupportedErrorModal"
          buttons={{
            primary: (
              <Button
                onPress={() => {
                  setIsNotSupportingQuickTransferErrorVisible(false);
                  delayTransition(() => navigation.navigate("InternalTransfers.StandardTransferScreen"));
                }}>
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.switchToStandardTransfers")}
              </Button>
            ),
            secondary: (
              <Button
                onPress={() => {
                  setIsNotSupportingQuickTransferErrorVisible(false);
                }}>
                {t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.cancel")}
              </Button>
            ),
          }}
        />
      ) : null}
      <NotificationModal
        onClose={handleErrorModal}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isQuickTransferErrorVisible}
        buttons={{
          primary: <Button onPress={handleErrorModal}>{t("errors.generic.button")}</Button>,
        }}
        variant="error"
        testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:ValidationErrorModal"
      />
      {undefined !== i18nKey ? (
        <NotificationModal
          onClose={() => {
            setIsQuickTransferValidationErrorVisible(false);
          }}
          message={t(`InternalTransfers.EnterQuickTransferBeneficiaryScreen.${i18nKey}.error.message`, {
            bankName: bankOptions.find(element => element.value === bankCode)?.label ?? "unknown",
          })}
          title={t(`InternalTransfers.EnterQuickTransferBeneficiaryScreen.${i18nKey}.error.title`)}
          isVisible={isQuickTransferValidationErrorVisible}
          variant="error"
          testID={`InternalTransfers.EnterQuickTransferBeneficiaryScreen:ValidationErrorModal-${i18nKey}`}
        />
      ) : null}
      <SwitchToARBModal
        isVisible={isSwitchToARBModalVisible}
        onSwitchToARBPress={handleOnSwitchToARB}
        onCancelPress={handleOnCancel}
        testID="InternalTransfers.EnterQuickTransferBeneficiaryScreen:SwitchToARBModal"
      />
    </>
  );
}

const ERROR_BENEFICIARY_DOESNOT_SUPPORT = "Beneficiary bank does not support quick transfers";
const ERROR_PHONE_NUMBER_INVALID = "Alias not found for mobileNo";
const ERROR_EMAIL_INVALID = "Alias not found for email";
const ERROR_NATIONAL_ID_NOT_EXIST = "Alias not found for nationalId";
const ERROR_IBAN_NOT_VALID = "Alias not found for IBAN";

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

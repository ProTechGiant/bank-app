import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import { ContactIcon } from "@/assets/icons";
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
import { InlineBanner } from "@/features/CardActions/components";
import InlineBannerButton from "@/features/CardActions/components/InlineBanner/InlineBannerButton";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { ibanRegExp, ibanRegExpForARB, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { BeneficiariesListWithSearchForTransfer, SelectedContact, SwitchToARBModal } from "../components";
import { useBeneficiaryBanks, useValidateQuickTransferBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiaryFormForwardRef, Contact } from "../types";

interface BeneficiaryInput {
  bankCode: string;
  email?: string;
  iban?: string;
  identifier?: string;
  name?: string;
  phoneNumber?: string;
  transferMethod: "beneficiaries" | "mobileNo" | "nationalId" | "IBAN" | "email";
}

export default function EnterLocalTransferBeneficiaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { setTransferType, transferAmount, reason } = useInternalTransferContext();

  const banks = useBeneficiaryBanks();
  const validateBeneficiaryAsync = useValidateQuickTransferBeneficiary();
  const contacts = useContacts();

  const [isSwitchToARBModalVisible, setIsSwitchToARBModalVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        bankCode: yup.string().required(),
        email: yup
          .string()
          .email(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.email.validation.invalid"))
          .when("transferMethod", {
            is: "email",
            then: yup
              .string()
              .required(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.email.validation.required")),
          }),
        iban: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.validation.required"))
            .length(24, t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.validation.lengthInvalid"))
            .matches(
              ibanRegExp,
              t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.validation.formatInvalid")
            ),
        }),
        identifier: yup.string().when("transferMethod", {
          is: "nationalId",
          then: yup
            .string()
            .matches(
              numericRegExp,
              t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.nationalId.validation.invalid")
            )
            .required(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.nationalId.validation.required"))
            .length(10, t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.nationalId.validation.invalid")),
        }),
        name: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.validation.required")),
        }),
        phoneNumber: yup.string().when("transferMethod", {
          is: "mobileNo",
          then: yup
            .string()
            .required(t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.mobileNo.validation.required"))
            .matches(
              saudiPhoneRegExp,
              t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.mobileNo.validation.invalid")
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
      transferMethod: "beneficiaries",
    },
  });
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [showPermissionConfirmationModal, setShowPermissionConfirmationModal] = useState(false);
  const mobileFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const [contact, setContact] = useState<Contact | undefined>(undefined);

  const [isBanksLoadingErrorVisible, setIsBanksLoadingErrorVisible] = useState(false);
  const [isNotSupportingQuickTransferErrorVisible, setIsNotSupportingQuickTransferErrorVisible] = useState(false);
  const [isQuickTransferErrorVisible, setIsQuickTransferErrorVisible] = useState(false);
  const [isQuickTransferValidationErrorVisible, setIsQuickTransferValidationErrorVisible] = useState(false);
  const [i18nKey, setI18nKey] = useState<"beneficiaries" | "email" | "mobileNo" | "nationalId" | "IBAN">();

  useEffect(() => {
    setIsBanksLoadingErrorVisible(banks.isError);
  }, [banks.isError]);

  useFocusEffect(() => {
    setPhoneNumber(contact?.phoneNumber);
    setName(contact?.name);
    setValue("phoneNumber", contact?.phoneNumber);
  }, []);

  const handleOnCancelSelectedContactsInfo = () => {
    setContact(undefined);
    if (mobileFormRef.current?.setSelectionValue) mobileFormRef.current?.setSelectionValue("");
  };

  const handleOnContactSelected = (selectedContact: Contact) => {
    setContact(selectedContact);
    if (mobileFormRef.current?.setSelectionValue) mobileFormRef.current?.setSelectionValue(selectedContact.phoneNumber);
  };

  const handleOnContactsPressed = async () => {
    if (await contacts.isContactsPermissionGranted(Platform.OS)) {
      navigation.navigate("InternalTransfers.ContactsScreen", {
        onContactSelected: handleOnContactSelected,
      });
    } else {
      setShowPermissionConfirmationModal(true);
    }
  };

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
        } else if (error.errorContent.Errors[0].ErrorId) {
          setI18nKey(getValues().transferMethod);
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

  const handleInlineBannerButtonPress = () => {
    handleOnContactsConfirmationModalPress();
  };

  const handleInlineBannerClosePress = () => {
    setIsPermissionDenied(false);
  };

  const handleOnContactsDeclineModalPress = () => {
    setShowPermissionConfirmationModal(false);
    setIsPermissionDenied(true);
  };

  const handleOnContactsConfirmationModalPress = async () => {
    setIsPermissionDenied(false);

    delayTransition(() => {
      setShowPermissionConfirmationModal(false);
    });

    try {
      const status = await contacts.isContactsPermissionGranted(Platform.OS);
      if (status) {
        navigation.navigate("InternalTransfers.ContactsScreen");
      } else {
        contacts
          .requestContactsPermissions(Platform.OS)
          .then(PermissionStatus => {
            if (PermissionStatus === "authorized" || PermissionStatus === "granted") {
              delayTransition(() => {
                navigation.navigate("InternalTransfers.ContactsScreen");
              });
            } else {
              Linking.openSettings();
            }
          })
          .catch(error => {
            warn("Contacts-Permissions-Status", "Could not get request permission: ", JSON.stringify(error));
            setIsPermissionDenied(true);
          });
      }
    } catch (error) {
      warn("Contacts-Permissions-Status", "Could not get permission Status: ", JSON.stringify(error));
    }
  };

  const identifiers = [
    {
      label: t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.transferByOptions.beneficiaries"),
      value: "beneficiaries",
    },
    { label: t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.transferByOptions.iban"), value: "IBAN" },
    { label: t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.transferByOptions.mobile"), value: "mobileNo" },
    { label: t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.transferByOptions.id"), value: "nationalId" },
    { label: t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.transferByOptions.email"), value: "email" },
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
    }));
  }, [banks.data]);

  const formContainerStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  const scrollViewContentStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const inlineBannerContainerStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  const inlineBannerButtonStyle = useThemeStyles(theme => ({
    borderRadius: theme.spacing["24p"],
    borderWidth: 0.5,
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.navTitle")}
          testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:NavHeader"
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView keyboardShouldPersistTaps="always" style={styles.container}>
            <Stack align="stretch" direction="vertical" gap="20p" style={formContainerStyle}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.title")}
              </Typography.Text>
              <Stack direction="horizontal" gap="8p">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={scrollViewContentStyle}>
                  {identifiers.map(element => (
                    <Pill
                      testID={`InternalTransfers.EnterLocalTransferBeneficiaryScreen:TransferMethodPill-${element.value}`}
                      key={element.value}
                      isActive={transferMethod === element.value}
                      onPress={() => {
                        setValue("transferMethod", element.value, { shouldValidate: true });
                      }}>
                      {element.label}
                    </Pill>
                  ))}
                </ScrollView>
              </Stack>
              {transferMethod !== "beneficiaries" && transferMethod !== "IBAN" ? (
                <DropdownInput
                  autoselect={false}
                  buttonLabel={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.beneficiaryBankConfirm")}
                  control={control}
                  isFixedHeight
                  placeholder="Select bank"
                  name="bankCode"
                  headerText={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.beneficiaryBankHeaderText")}
                  options={bankOptions}
                  label={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.beneficiaryBankLabel")}
                  testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:BeneficiaryBankDropdown"
                />
              ) : null}
              {transferMethod === "mobileNo" ? (
                <View>
                  {phoneNumber !== undefined && name !== undefined ? (
                    <>
                      <SelectedContact
                        fullName={name}
                        contactInfo={phoneNumber}
                        onCancelPress={handleOnCancelSelectedContactsInfo}
                        testID="InternalTransfers.InternalTransferCTCAndCTAScreen"
                      />
                    </>
                  ) : (
                    <>
                      <PhoneNumberInput
                        control={control}
                        label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.label")}
                        name="phoneNumber"
                        testID="InternalTransfers.InternalTransferCTCAndCTAScreen:PhoneNumberInput"
                        onContactPress={handleOnContactsPressed}
                      />
                      {isPermissionDenied ? (
                        <View style={inlineBannerContainerStyle}>
                          <InlineBanner
                            action={
                              <InlineBannerButton
                                text={t(
                                  "InternalTransfers.InternalTransferCTCAndCTAScreen.permissionInlineBanner.allowAccessbutton"
                                )}
                                onPress={handleInlineBannerButtonPress}
                                style={inlineBannerButtonStyle}
                              />
                            }
                            onClose={handleInlineBannerClosePress}
                            icon={<ContactIcon />}
                            title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.permissionInlineBanner.title")}
                            text={t(
                              "InternalTransfers.InternalTransferCTCAndCTAScreen.permissionInlineBanner.description"
                            )}
                            testID="CardActions.InternalTransferCTCAndCTAScreen:PermissionDeclineInlineBanner"
                          />
                        </View>
                      ) : null}
                    </>
                  )}
                </View>
              ) : transferMethod === "email" ? (
                <TextInput
                  value={getValues("email")}
                  onClear={() => {
                    setValue("email", "");
                  }}
                  autoComplete="email"
                  autoCapitalize="none"
                  control={control}
                  label={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.email.label")}
                  name="email"
                  placeholder={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.email.placeholder")}
                  testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:EmailInput"
                />
              ) : transferMethod === "nationalId" ? (
                <MaskedTextInput
                  onClear={() => {
                    setValue("identifier", "");
                  }}
                  value={getValues("identifier")}
                  control={control}
                  label={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.nationalId.label")}
                  keyboardType="number-pad"
                  mask={Masks.NATIONAL_ID}
                  name="identifier"
                  testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:NationalIDInput"
                />
              ) : transferMethod === "IBAN" ? (
                <Stack align="stretch" direction="vertical" gap="20p">
                  <TextInput
                    value={getValues("name")}
                    onClear={() => {
                      setValue("name", "");
                    }}
                    control={control}
                    label={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.fullNameLabel")}
                    name="name"
                    placeholder={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.fullNamePlaceholder")}
                    testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:FullNameInput"
                  />
                  <MaskedTextInput
                    value={getValues("iban")}
                    onClear={() => {
                      setValue("iban", "");
                    }}
                    autoCapitalize="characters"
                    control={control}
                    label={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.IBAN.ibanLabel")}
                    name="iban"
                    mask={Masks.IBAN}
                    testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:IBANInput"
                  />
                </Stack>
              ) : (
                <BeneficiariesListWithSearchForTransfer />
              )}
            </Stack>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:ContinueButton">
              {t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.continue")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsBanksLoadingErrorVisible(false);
          delayTransition(() => navigation.goBack());
        }}
        message={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.beneficiaryBanksError.message")}
        title={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.beneficiaryBanksError.title")}
        isVisible={isBanksLoadingErrorVisible}
        variant="error"
        testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:BeneficiaryBanksErrorModal"
      />
      {bankCode !== undefined ? (
        <NotificationModal
          onClose={() => setIsNotSupportingQuickTransferErrorVisible(false)}
          message={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.quickTransfersUnsupportedError.message", {
            bankName: bankOptions.find(element => element.value === bankCode)?.label ?? "unknown",
          })}
          title={t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.quickTransfersUnsupportedError.title")}
          isVisible={isNotSupportingQuickTransferErrorVisible}
          variant="error"
          testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:QuickTransfersUnsupportedErrorModal"
          buttons={{
            primary: (
              <Button
                onPress={() => {
                  setIsNotSupportingQuickTransferErrorVisible(false);
                  delayTransition(() => navigation.navigate("InternalTransfers.StandardTransferScreen"));
                }}>
                {t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.switchToStandardTransfers")}
              </Button>
            ),
            secondary: (
              <Button
                onPress={() => {
                  setIsNotSupportingQuickTransferErrorVisible(false);
                }}>
                {t("InternalTransfers.EnterLocalTransferBeneficiaryScreen.cancel")}
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
        testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:ValidationErrorModal"
      />
      {undefined !== i18nKey ? (
        <NotificationModal
          onClose={() => {
            setIsQuickTransferValidationErrorVisible(false);
          }}
          message={t(`InternalTransfers.EnterLocalTransferBeneficiaryScreen.${i18nKey}.error.message`)}
          title={t(`InternalTransfers.EnterLocalTransferBeneficiaryScreen.${i18nKey}.error.title`)}
          isVisible={isQuickTransferValidationErrorVisible}
          variant="error"
          testID={`InternalTransfers.EnterLocalTransferBeneficiaryScreen:ValidationErrorModal-${i18nKey}`}
        />
      ) : null}
      <SwitchToARBModal
        isVisible={isSwitchToARBModalVisible}
        onSwitchToARBPress={handleOnSwitchToARB}
        onCancelPress={handleOnCancel}
        testID="InternalTransfers.EnterLocalTransferBeneficiaryScreen:SwitchToARBModal"
      />
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              onPress={handleOnContactsConfirmationModalPress}
              testID="InternalTransfers.InternalTransferCTCAndCTAScreen:ContactsPermissionModalConfirmButton">
              {t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.confirmationButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleOnContactsDeclineModalPress}
              testID="InternalTransfers.InternalTransferCTCAndCTAScreen:ContactsPermissionModalCancelButton">
              {t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.declineButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.title")}
        title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.description")}
        isVisible={showPermissionConfirmationModal}
        testID="InternalTransfers.InternalTransferCTCAndCTAScreen:CardConfirmationModal"
      />
    </>
  );
}

const ERROR_BENEFICIARY_DOESNOT_SUPPORT = "Beneficiary bank does not support quick transfers";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  keyboard: {
    flex: 1,
  },
});

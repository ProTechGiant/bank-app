import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/native";
import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import * as yup from "yup";

import { AlRajhiIcon, CloseIcon, CroatiaLogoIcon, InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, Stack } from "@/components";
import Button from "@/components/Button";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInputComponent from "@/components/Form/TextInput";
import { Masks } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { alphaRegExp, ibanRegExp, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { BeneficiariesListWithSearchForTransfer, SelectedContact } from "../components";
import CountDownModel from "../components/CountDownModel";
import { useVerifyInternalBeneficiarySelectionType } from "../hooks/query-hooks";
import { AddBeneficiaryFormForwardRef, Contact } from "../types";
import { formatContactNumberToSaudi } from "../utils";

interface TransferViaTypes {
  title: string;
  transferMethod: "phoneNumber" | "nationalId" | "IBAN" | "email" | "beneficiaries" | "accountNumber";
}

interface BeneficiaryInput {
  beneficiaries?: string;
  accountNumber?: string;
  email?: string;
  iban?: string;
  identifier?: string;
  phoneNumber?: string;
  fullName?: string;
  transferMethod: "phoneNumber" | "nationalId" | "IBAN" | "email" | "beneficiaries" | "accountNumber";
}

export default function InternalTransferCTCAndCTAScreen() {
  const { t } = useTranslation();
  const contacts = useContacts();
  const navigation = useNavigation();
  const account = useCurrentAccount();
  const { phoneNumber: currentUserPhoneNumber, nationalId } = useAuthContext();
  const { transferAmount, reason, transferType, setRecipient, isReadOnly, signInTime } = useInternalTransferContext();

  const mobileFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const [contact, setContact] = useState<Contact | undefined>(undefined);

  const accountNumber = account.data?.id;
  const ibanNumber = account.data?.iban;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitleMessage, setErrorTitleMessage] = useState("");
  const [errorDescriptionMessage, setErrorDescriptionMessage] = useState("");
  const [isCountDownModalVisible, setIsCountDownModalVisible] = useState<boolean>(false);

  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  const verifyInternalTransSelectionTypeAsync = useVerifyInternalBeneficiarySelectionType();

  const transferVia: TransferViaTypes[] =
    transferType === TransferType.CroatiaToArbTransferAction
      ? [
          {
            title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.BeneficiariesKey"),
            transferMethod: "beneficiaries",
          },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobileNoKey"), transferMethod: "phoneNumber" },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.idKey"), transferMethod: "nationalId" },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.emailKey"), transferMethod: "email" },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.IBANKey"), transferMethod: "IBAN" },
        ]
      : [
          {
            title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.BeneficiariesKey"),
            transferMethod: "beneficiaries",
          },
          {
            title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumberKey"),
            transferMethod: "accountNumber",
          },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobileNoKey"), transferMethod: "phoneNumber" },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.idKey"), transferMethod: "nationalId" },
          { title: t("InternalTransfers.InternalTransferCTCAndCTAScreen.emailKey"), transferMethod: "email" },
        ];

  useFocusEffect(() => {
    setPhoneNumber(contact?.phoneNumber);
    setName(contact?.name);
    setValue("phoneNumber", contact?.phoneNumber);
  });

  const handleOnCancelSelectedContactsInfo = () => {
    setContact(undefined);
    if (mobileFormRef.current?.setSelectionValue) mobileFormRef.current?.setSelectionValue("");
  };

  const handleOnContactSelected = (selectedContact: Contact) => {
    setContact(selectedContact);
    if (mobileFormRef.current?.setSelectionValue) mobileFormRef.current?.setSelectionValue(selectedContact.phoneNumber);
  };

  const handleOnContactsPressed = async () => {
    try {
      const status = await contacts.isContactsPermissionGranted(Platform.OS);
      if (status) {
        navigation.navigate("InternalTransfers.ContactsScreen", {
          onContactSelected: handleOnContactSelected,
        });
      } else {
        contacts
          .requestContactsPermissions(Platform.OS)
          .then(PermissionStatus => {
            if (PermissionStatus === "authorized" || PermissionStatus === "granted") {
              delayTransition(() => {
                navigation.navigate("InternalTransfers.ContactsScreen", {
                  onContactSelected: handleOnContactSelected,
                });
              });
            } else {
              Linking.openSettings();
            }
          })
          .catch(error => {
            warn("Contacts-Permissions-Status", "Could not get request permission: ", JSON.stringify(error));
          });
      }
    } catch (error) {
      warn("Contacts-Permissions-Status", "Could not get permission Status: ", JSON.stringify(error));
    }
  };

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email(t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.validation.invalid"))
          .when("transferMethod", {
            is: "email",
            then: yup.string(),
          }),
        iban: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .matches(ibanRegExp, t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.validation.formatInvalid"))
            .test("iban-match", t("InternalTransfers.EnterBeneficiaryDetailsScreen.sameAccountNotAllowed"), value => {
              return value !== ibanNumber;
            })
            .length(24, t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.validation.lengthInvalid")),
        }),
        fullName: yup
          .string()
          .notRequired()
          .matches(alphaRegExp, t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.fullNameValidationError")),

        accountNumber: yup.string().when("transferMethod", {
          is: "accountNumber",
          then: yup
            .string()
            .matches(
              numericRegExp,
              t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalid")
            )
            .test(
              "is-equal-to-account-number",
              t("InternalTransfers.EnterBeneficiaryDetailsScreen.sameAccountNotAllowed"),
              value => {
                return value !== accountNumber;
              }
            )
            .length(
              transferType === TransferType.CroatiaToArbTransferAction ? 21 : 9,
              transferType === TransferType.CroatiaToArbTransferAction
                ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalidArbAccount")
                : t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalid")
            ),
        }),

        identifier: yup.string().when("transferMethod", {
          is: "nationalId",
          then: yup
            .string()
            .matches(
              numericRegExp,
              t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.validation.invalid")
            )
            .test(
              "nationalId-match",
              t("InternalTransfers.EnterBeneficiaryDetailsScreen.sameAccountNotAllowed"),
              value => {
                return value !== nationalId;
              }
            )
            .length(10, t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.validation.invalid")),
        }),

        phoneNumber: yup.string().when("transferMethod", {
          is: "phoneNumber",
          then: yup
            .string()
            .matches(saudiPhoneRegExp, t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.validation.invalid"))
            .test(
              "is-equal-to-phone-number",
              t("InternalTransfers.EnterBeneficiaryDetailsScreen.sameAccountNotAllowed"),
              value => {
                return value !== currentUserPhoneNumber;
              }
            )
            .length(13, t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.validation.invalid")),
        }),
      }),
    [t]
  );

  const { control, handleSubmit, setValue, watch, reset } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      transferMethod: "beneficiaries",
    },
  });

  const handleOnSelectedContactSubmitPress = async () => {
    try {
      if (
        phoneNumber === undefined ||
        transferAmount === undefined ||
        reason === undefined ||
        transferType === undefined
      )
        return;

      const response = await verifyInternalTransSelectionTypeAsync.mutateAsync({
        beneficiaryType:
          transferType === TransferType.InternalTransferAction ? "INTERNAL_TRANSFER" : "CROATIA_TO_ARB_TRANSFER",
        selectionType: "mobileNo",
        selectionValue: formatContactNumberToSaudi(phoneNumber),
      });

      setRecipient({
        accountName: response.AccountName ?? "",
        accountNumber: response.AccountNumber,
        iban: response.AccountIban,
        type: "active",
        bankName:
          transferType === TransferType.InternalTransferAction
            ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.croatiaBank")
            : t("InternalTransfers.InternalTransferCTCAndCTAScreen.alrajhiBank"),
        adhocBeneficiaryId: response.AdhocBeneficiaryId ?? undefined,
        beneficiaryId: undefined,
        phoneNumber: "",
      });

      navigation.navigate("InternalTransfers.ReviewTransferScreen");
    } catch (err) {
      const errorId =
        err.errorContent?.Errors && err.errorContent?.Errors[0] && err.errorContent?.Errors[0].ErrorId
          ? err.errorContent?.Errors[0]?.ErrorId
          : "";

      setShowErrorModal(true);
      switch (errorId) {
        case "0096":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.error.title"));
          setErrorDescriptionMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.error.message"));
          break;

        case "0099":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.validation.invalid"));
          setErrorDescriptionMessage("");
          break;

        default:
          setErrorTitleMessage(t("errors.generic.title"));
          setErrorDescriptionMessage(t("errors.generic.tryAgainLater"));
          break;
      }

      warn("Internal Transfer CTC-CTA", "Could not validate internal transfer selection type: ", JSON.stringify(err));
    }
  };

  const handleOnSubmit = async (beneficiaryInput: BeneficiaryInput) => {
    Keyboard.dismiss();

    let selectionValue;

    switch (beneficiaryInput.transferMethod) {
      case "email":
        selectionValue = beneficiaryInput.email;
        break;
      case "IBAN":
        selectionValue = beneficiaryInput.iban;
        break;
      case "nationalId":
        selectionValue = beneficiaryInput.identifier;
        break;
      case "phoneNumber":
        selectionValue = beneficiaryInput.phoneNumber;
        break;
      case "accountNumber":
        selectionValue = beneficiaryInput.accountNumber;
        break;
      default:
        selectionValue = undefined;
        break;
    }

    if (selectionValue === undefined) {
      return;
    }

    try {
      const response = await verifyInternalTransSelectionTypeAsync.mutateAsync({
        beneficiaryType:
          transferType === TransferType.InternalTransferAction ? "INTERNAL_TRANSFER" : "CROATIA_TO_ARB_TRANSFER",
        selectionType: transferMethod === "phoneNumber" ? "mobileNo" : transferMethod,
        selectionValue: selectionValue,
      });
      if (transferAmount === undefined || reason === undefined || transferType === undefined) return;

      setRecipient({
        accountName: response.AccountName ?? "",
        accountNumber: response.AccountNumber,
        iban: response.AccountIban,
        type: "active",
        bankName:
          transferType === TransferType.InternalTransferAction
            ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.croatiaBank")
            : t("InternalTransfers.InternalTransferCTCAndCTAScreen.alrajhiBank"),
        adhocBeneficiaryId: response.AdhocBeneficiaryId ?? undefined,
        beneficiaryId: undefined,
        phoneNumber: "",
      });

      navigation.navigate("InternalTransfers.ReviewTransferScreen");
    } catch (err) {
      const errorId =
        err.errorContent?.Errors[0] && err.errorContent?.Errors[0].ErrorId ? err.errorContent?.Errors[0]?.ErrorId : "";
      setShowErrorModal(true);
      switch (errorId) {
        // TODO: error codes will be replaced once the acutal implementation is done from the backend side.
        case "0050":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.error.title"));
          setErrorDescriptionMessage(
            t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.error.message")
          );
          break;

        case "0095":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.error.title"));
          setErrorDescriptionMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.error.message"));
          break;

        case "0096":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.error.title"));
          setErrorDescriptionMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.error.message"));
          break;

        case "0094":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.error.title"));
          setErrorDescriptionMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.error.message"));
          break;

        case "0055":
          setErrorTitleMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.error.title"));
          setErrorDescriptionMessage(t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.error.message"));
          break;

        default:
          setErrorTitleMessage(t("errors.generic.title"));
          setErrorDescriptionMessage(t("errors.generic.tryAgainLater"));
          break;
      }

      warn("Internal Transfer CTC-CTA", "Could not validate internal transfer selection type: ", JSON.stringify(err));
    }
  };

  const handleOnTransferLimitsPress = () => {
    //TODO: this will be implemented later on.
  };

  const handleOnCountDowndModalClose = () => {
    setIsCountDownModalVisible(false);
    navigation.navigate("Transfers.TrasnfersLandingScreen");
  };
  const scrollViewContentStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const titleStyle = useThemeStyles(theme => ({
    marginHorizontal: theme.spacing["24p"],
    marginVertical: theme.spacing["16p"],
  }));

  const croatiaLogoContainerStyle = useThemeStyles(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["32p"],
  }));

  const logoRoundStyle = useThemeStyles(theme => ({
    borderWidth: 1,
    padding: theme.spacing["12p"],
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.spacing["64p"],
  }));

  const viewContainerStyle = useThemeStyles(theme => ({
    margin: theme.spacing["20p"],
  }));

  const logoIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const transferMethod = watch("transferMethod");

  const crossIconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["4p"],
    paddingVertical: 2,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={false}
        title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.title")}
        testID="InternalTransfers.InternalTransferCTCAndCTAScreen:NavHeader"
        end={
          <Pressable style={crossIconStyle} onPress={() => navigation.goBack()}>
            <CloseIcon />
          </Pressable>
        }
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled>
        <ScrollView>
          <Stack direction="vertical" gap="16p" align="stretch" flex={1}>
            <View style={titleStyle}>
              <RightIconLink
                onPress={handleOnTransferLimitsPress}
                icon={<InfoCircleIcon />}
                linkColor="neutralBase+30"
                iconColor="neutralBase+30"
                textSize="title2"
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen.limit">
                {t("InternalTransfers.InternalTransferCTCAndCTAScreen.titleDescription")}
              </RightIconLink>
            </View>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={scrollViewContentStyle}>
                {transferVia.map(element => (
                  <Pill
                    testID={`InternalTransfers.InternalTransferCTCAndCTAScreen:TransferMethodPill-${element.transferMethod}`}
                    key={element.title}
                    isActive={transferMethod === element.transferMethod}
                    onPress={() => {
                      reset();
                      if (isReadOnly && element.title !== "Beneficiaries") {
                        setIsCountDownModalVisible(true);
                      }
                      setValue("transferMethod", element.transferMethod, { shouldValidate: true });
                    }}>
                    {element.title}
                  </Pill>
                ))}
              </ScrollView>
            </View>
            {transferMethod !== "beneficiaries" ? (
              <View style={[croatiaLogoContainerStyle, styles.logoContainerStyleFlex]}>
                <View style={logoRoundStyle}>
                  <View>
                    {transferType === TransferType.InternalTransferAction ? (
                      <CroatiaLogoIcon color={logoIconColor} width={30} height={30} />
                    ) : (
                      <AlRajhiIcon width={30} height={30} />
                    )}
                  </View>
                </View>
                <Typography.Text size="callout" weight="regular" style={titleStyle}>
                  {transferType === TransferType.InternalTransferAction
                    ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.croatiaBank")
                    : t("InternalTransfers.InternalTransferCTCAndCTAScreen.alrajhiBank")}
                </Typography.Text>
              </View>
            ) : undefined}

            <View style={viewContainerStyle}>
              {transferMethod === "phoneNumber" ? (
                <View>
                  {phoneNumber !== undefined && name !== undefined ? (
                    <>
                      <SelectedContact
                        fullName={name}
                        contactInfo={formatContactNumberToSaudi(phoneNumber)}
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
                    </>
                  )}
                </View>
              ) : transferMethod === "email" ? (
                <TextInputComponent
                  autoComplete="email"
                  autoCapitalize="none"
                  control={control}
                  label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.email")}
                  name="email"
                  placeholder={t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.placeholder")}
                  testID="InternalTransfers.InternalTransferCTCAndCTAScreen:EmailInput"
                />
              ) : transferMethod === "beneficiaries" ? (
                <View>
                  <BeneficiariesListWithSearchForTransfer />
                </View>
              ) : transferMethod === "IBAN" ? (
                <Stack direction="vertical" gap="16p" align="stretch">
                  {transferType !== TransferType.InternalTransferAction ? (
                    <TextInputComponent
                      control={control}
                      keyboardType="name-phone-pad"
                      label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.fullNameLabel")}
                      name="fullName"
                      placeholder={t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.fullNamePlacholder")}
                      testID="InternalTransfers.InternalTransferCTCAndCTAScreen:IBANFullNameInput"
                      onClear={() => setValue("fullName", "")}
                    />
                  ) : null}
                  <MaskedTextInput
                    keyboardType="number-pad"
                    autoCapitalize="characters"
                    control={control}
                    label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.ibanLabel")}
                    name="iban"
                    mask={Masks.IBAN}
                    testID="InternalTransfers.InternalTransferCTCAndCTAScreen:IBANInput"
                  />
                </Stack>
              ) : transferMethod === "nationalId" ? (
                <MaskedTextInput
                  control={control}
                  label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.label")}
                  keyboardType="number-pad"
                  mask={Masks.NATIONAL_ID}
                  name="identifier"
                  testID="InternalTransfers.InternalTransferCTCAndCTAScreen:NationalIDInput"
                  hideEndText={true}
                />
              ) : transferMethod === "accountNumber" ? (
                <MaskedTextInput
                  control={control}
                  label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.label")}
                  keyboardType="number-pad"
                  mask={
                    transferType === TransferType.CroatiaToArbTransferAction
                      ? Masks.ACCOUNT_NUMBER_ARB
                      : Masks.ACCOUNT_NUMBER
                  }
                  name="accountNumber"
                  testID="InternalTransfers.InternalTransferCTCAndCTAScreen:AccountNoInput"
                  hideEndText={true}
                />
              ) : null}
            </View>
          </Stack>
        </ScrollView>
        {transferMethod !== "beneficiaries" ? (
          <View style={viewContainerStyle}>
            {transferMethod === "phoneNumber" && phoneNumber !== undefined && name !== undefined ? (
              <Button
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen:ContinueButton"
                disabled={transferMethod === "phoneNumber" && phoneNumber === undefined && name === undefined}
                onPress={handleOnSelectedContactSubmitPress}>
                {t("InternalTransfers.InternalTransferCTCAndCTAScreen.continue")}
              </Button>
            ) : (
              <SubmitButton
                control={control}
                onSubmit={handleSubmit(handleOnSubmit)}
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen:ContinueButton">
                {t("InternalTransfers.InternalTransferCTCAndCTAScreen.continue")}
              </SubmitButton>
            )}
          </View>
        ) : undefined}
      </KeyboardAvoidingView>

      {/* selection transfer type api level validation error */}
      <NotificationModal
        onClose={() => {
          setShowErrorModal(false);
        }}
        title={errorTitleMessage}
        message={errorDescriptionMessage}
        isVisible={showErrorModal}
        variant="error"
      />
      <CountDownModel
        title={t("InternalTransfers.DeviceControlModelScreen.restrictQuickTransferTitle")}
        message={t("InternalTransfers.DeviceControlModelScreen.restrictActionMessage")}
        deviceSignInDate={signInTime}
        isVisible={isCountDownModalVisible}
        onClose={handleOnCountDowndModalClose}
        testID="InternalTransfers.DeviceControlModelScreen:QuickTransferError"
      />

      {/*TODO: Transfer limit modal needs to be implemented. */}
    </Page>
  );
}
const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  logoContainerStyleFlex: {
    flexDirection: "row",
  },
});

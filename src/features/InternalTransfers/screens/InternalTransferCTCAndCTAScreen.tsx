import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "@react-navigation/native";
import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import * as yup from "yup";

import { AlRajhiIcon, ContactIcon, CroatiaLogoIcon, InfoCircleIcon } from "@/assets/icons";
import { RightIconLink, Stack } from "@/components";
import Button from "@/components/Button";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { Masks } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { InlineBanner } from "@/features/CardActions/components";
import InlineBannerButton from "@/features/CardActions/components/InlineBanner/InlineBannerButton";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { ibanRegExp, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { SelectedContact } from "../components";
import { AddBeneficiaryFormForwardRef, Contact } from "../types";

interface TransferViaTypes {
  title: string;
  transferMethod: "mobileNo" | "nationalId" | "IBAN" | "email" | "beneficiaries" | "account";
}

interface BeneficiaryInput {
  beneficiaries?: string;
  account?: string;
  email?: string;
  iban?: string;
  identifier?: string;
  phoneNumber?: string;
  transferMethod: "mobileNo" | "nationalId" | "IBAN" | "email" | "beneficiaries" | "account";
}

export default function InternalTransferCTCAndCTAScreen() {
  const { t } = useTranslation();
  const contacts = useContacts();
  const navigation = useNavigation();
  const [showPermissionConfirmationModal, setShowPermissionConfirmationModal] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const mobileFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const [contact, setContact] = useState<Contact | undefined>(undefined);

  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const { transferType } = useInternalTransferContext();

  const transferVia: TransferViaTypes[] = [
    { title: "Beneficiaries", transferMethod: "beneficiaries" },
    { title: "Account Number", transferMethod: "account" },
    { title: "Mobile", transferMethod: "mobileNo" },
    { title: "ID", transferMethod: "nationalId" },
    { title: "Email", transferMethod: "email" },
    { title: "IBAN", transferMethod: "IBAN" },
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
    if (await contacts.isContactsPermissionGranted(Platform.OS)) {
      navigation.navigate("InternalTransfers.ContactsScreen", {
        onContactSelected: handleOnContactSelected,
      });
    } else {
      setShowPermissionConfirmationModal(true);
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
            then: yup
              .string()
              .required(t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.validation.required")),
          }),
        iban: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .required(t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.validation.required"))
            .length(24, t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.validation.lengthInvalid"))
            .matches(ibanRegExp, t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.validation.formatInvalid")),
        }),
        accountNumber: yup.string().when("transferMethod", {
          is: "account",
          then: yup
            .string()
            .required(t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.required"))
            .length(
              transferType === TransferType.CroatiaToArbTransferAction ? 21 : 9,
              transferType === TransferType.CroatiaToArbTransferAction
                ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalidArbAccount")
                : t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalid")
            )
            .matches(
              numericRegExp,
              t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.validation.invalid")
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
            .required(t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.validation.required"))
            .length(10, t("InternalTransfers.InternalTransferCTCAndCTAScreen.nationalID.validation.invalid")),
        }),

        phoneNumber: yup.string().when("transferMethod", {
          is: "mobileNo",
          then: yup
            .string()
            .required(t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.validation.required"))
            .matches(
              saudiPhoneRegExp,
              t("InternalTransfers.InternalTransferCTCAndCTAScreen.mobile.validation.invalid")
            ),
        }),
      }),
    [t]
  );

  const { control, handleSubmit, setValue, watch } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      transferMethod: "beneficiaries",
    },
  });

  const handleOnSubmit = () => {
    //TODO: will be implemented when API will be available.
    console.log("ON Submit pressed");
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

  const handleOnContactsDeclineModalPress = () => {
    setShowPermissionConfirmationModal(false);
    setIsPermissionDenied(true);
  };

  const handleInlineBannerButtonPress = () => {
    handleOnContactsConfirmationModalPress();
  };

  const handleInlineBannerClosePress = () => {
    setIsPermissionDenied(false);
  };

  const handleOnTransferLimitsPress = () => {
    //TODO: this will be implemented later on.
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
  const inlineBannerButtonStyle = useThemeStyles(theme => ({
    borderRadius: theme.spacing["24p"],
    borderWidth: 0.5,
  }));

  const inlineBannerContainerStyle = useThemeStyles(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  const logoIconColor = useThemeStyles(theme => theme.palette.complimentBase);

  const transferMethod = watch("transferMethod");

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.title")}
        testID="InternalTransfers.InternalTransferCTCAndCTAScreen:NavHeader"
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled>
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
                  onPress={() => setValue("transferMethod", element.transferMethod, { shouldValidate: true })}>
                  {element.title}
                </Pill>
              ))}
            </ScrollView>
          </View>
          <View style={[croatiaLogoContainerStyle, styles.logoContainerStyleFlex]}>
            <View style={logoRoundStyle}>
              {transferType === TransferType.InternalTransferAction ? (
                <CroatiaLogoIcon color={logoIconColor} width={30} height={30} />
              ) : (
                <AlRajhiIcon width={30} height={30} />
              )}
            </View>
            <Typography.Text size="callout" weight="regular" style={titleStyle}>
              {transferType === TransferType.InternalTransferAction
                ? t("InternalTransfers.InternalTransferCTCAndCTAScreen.croatiaBank")
                : t("InternalTransfers.InternalTransferCTCAndCTAScreen.alrajhiBank")}
            </Typography.Text>
          </View>

          <View style={viewContainerStyle}>
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
                          // style={styles.permissionWarningBannerContainer}
                          icon={<ContactIcon />}
                          title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.permissionInlineBanner.title")}
                          text={t(
                            "InternalTransfers.InternalTransferCTCAndCTAScreen.permissionInlineBanner.description"
                          )}
                          testID="CardActions.InternalTransferCroatiaToCroatiaScreen:PermissionDeclineInlineBanner"
                        />
                      </View>
                    ) : null}
                  </>
                )}
              </View>
            ) : transferMethod === "email" ? (
              <TextInput
                autoComplete="email"
                autoCapitalize="none"
                control={control}
                label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.email")}
                name="email"
                placeholder={t("InternalTransfers.InternalTransferCTCAndCTAScreen.email.placeholder")}
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen:EmailInput"
              />
            ) : transferMethod === "IBAN" ? (
              <MaskedTextInput
                autoCapitalize="characters"
                control={control}
                label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.iban.ibanLabel")}
                name="iban"
                mask={Masks.IBAN}
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen:IBANInput"
              />
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
            ) : transferMethod === "account" ? (
              <MaskedTextInput
                control={control}
                label={t("InternalTransfers.InternalTransferCTCAndCTAScreen.accountNumber.label")}
                keyboardType="number-pad"
                mask={
                  transferType === TransferType.CroatiaToArbTransferAction
                    ? Masks.ACCOUNT_NUMBER_ARB
                    : Masks.ACCOUNT_NUMBER
                }
                name="account"
                testID="InternalTransfers.InternalTransferCTCAndCTAScreen:AccountNoInput"
                hideEndText={true}
              />
            ) : null}
          </View>
        </Stack>
        <View style={viewContainerStyle}>
          <SubmitButton
            control={control}
            onSubmit={handleSubmit(handleOnSubmit)}
            testID="InternalTransfers.InternalTransferCTCAndCTAScreen:ContinueButton">
            {t("InternalTransfers.InternalTransferCTCAndCTAScreen.continue")}
          </SubmitButton>
        </View>
      </KeyboardAvoidingView>

      {/* Lock confirmation modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              onPress={handleOnContactsConfirmationModalPress}
              testID="CardActions.InternalTransferCTCAndCTAScreen:ContactsPermissionModalConfirmButton">
              {t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.confirmationButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleOnContactsDeclineModalPress}
              testID="CardActions.InternalTransferCTCAndCTAScreen:ContactsPermissionModalCancelButton">
              {t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.declineButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.title")}
        title={t("InternalTransfers.InternalTransferCTCAndCTAScreen.confirmationModal.description")}
        isVisible={showPermissionConfirmationModal}
        testID="CardActions.InternalTransferCTCAndCTAScreen:CardConfirmationModal"
      />
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

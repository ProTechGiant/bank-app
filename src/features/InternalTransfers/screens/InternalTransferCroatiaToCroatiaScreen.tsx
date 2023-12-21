import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import * as yup from "yup";

import { ContactIcon, CroatiaLogoIcon } from "@/assets/icons";
import { Stack } from "@/components";
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
import { InlineBanner } from "@/features/CardActions/components";
import InlineBannerButton from "@/features/CardActions/components/InlineBanner/InlineBannerButton";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { ibanRegExp, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { SelectedContact } from "../components";

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

export default function InternalTransferCroatiaToCroatiaScreen() {
  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ContactsScreen">>();

  const { t } = useTranslation();
  const contacts = useContacts();
  const navigation = useNavigation();
  const [showPermissionConfirmationModal, setShowPermissionConfirmationModal] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const phoneNumberRouteParams = route.params !== undefined ? route.params?.phoneNumber : undefined;
  const nameRouteParams = route.params !== undefined ? route.params?.name : undefined;

  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [name, setName] = useState(undefined);

  const transferVia: TransferViaTypes[] = [
    { title: "Beneficiaries", transferMethod: "beneficiaries" },
    { title: "Account Number", transferMethod: "account" },
    { title: "Mobile", transferMethod: "mobileNo" },
    { title: "ID", transferMethod: "nationalId" },
    { title: "Email", transferMethod: "email" },
    { title: "IBAN", transferMethod: "IBAN" },
  ];

  useEffect(() => {
    setPhoneNumber(phoneNumberRouteParams);
    setName(nameRouteParams);
  }, [phoneNumberRouteParams, nameRouteParams]);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email(t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.email.validation.invalid"))
          .when("transferMethod", {
            is: "email",
            then: yup
              .string()
              .required(t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.email.validation.required")),
          }),
        iban: yup.string().when("transferMethod", {
          is: "IBAN",
          then: yup
            .string()
            .required(t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.iban.validation.required"))
            .length(24, t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.iban.validation.lengthInvalid"))
            .matches(
              ibanRegExp,
              t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.iban.validation.formatInvalid")
            ),
        }),

        identifier: yup.string().when("transferMethod", {
          is: "nationalId",
          then: yup
            .string()
            .matches(
              numericRegExp,
              t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.nationalID.validation.invalid")
            )
            .required(t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.nationalID.validation.required"))
            .length(10, t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.nationalID.validation.invalid")),
        }),

        phoneNumber: yup.string().when("transferMethod", {
          is: "mobileNo",
          then: yup
            .string()
            .required(t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.mobile.validation.required"))
            .matches(
              saudiPhoneRegExp,
              t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.mobile.validation.invalid")
            ),
        }),
      }),
    [t]
  );

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

  const handleOnContactsPressed = async () => {
    if (await contacts.isContactsPermissionGranted(Platform.OS)) {
      navigation.navigate("InternalTransfers.ContactsScreen");
    } else {
      setShowPermissionConfirmationModal(true);
    }
  };

  const handleInlineBannerButtonPress = () => {
    handleOnContactsConfirmationModalPress();
  };

  const handleOnCancelSelectedContactsInfo = () => {
    setPhoneNumber(undefined);
    setName(undefined);
  };

  const handleInlineBannerClosePress = () => {
    setIsPermissionDenied(false);
  };

  const { control, handleSubmit, setValue, watch } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      transferMethod: "beneficiaries",
    },
  });

  const scrollViewContentStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const titleStyle = useThemeStyles(theme => ({
    marginHorizontal: theme.spacing["20p"],
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
        title={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.title")}
        testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:NavHeader"
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled>
        <Stack direction="vertical" gap="16p" align="stretch" flex={1}>
          <Typography.Text size="title2" weight="medium" style={titleStyle}>
            {t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.titleDescription")}
          </Typography.Text>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={scrollViewContentStyle}>
              {transferVia.map(element => (
                <Pill
                  testID={`InternalTransfers.InternalTransferCroatiaToCroatiaScreen:TransferMethodPill-${element.transferMethod}`}
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
              <CroatiaLogoIcon color={logoIconColor} width={30} height={30} />
            </View>
            <Typography.Text size="callout" weight="regular" style={titleStyle}>
              {t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.croatiaBank")}
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
                      testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen"
                    />
                  </>
                ) : (
                  <>
                    <PhoneNumberInput
                      control={control}
                      label={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.mobile.label")}
                      name="phoneNumber"
                      testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:PhoneNumberInput"
                      onContactPress={handleOnContactsPressed}
                    />
                    {isPermissionDenied ? (
                      <View style={inlineBannerContainerStyle}>
                        <InlineBanner
                          action={
                            <InlineBannerButton
                              text={t(
                                "InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.allowAccessbutton"
                              )}
                              onPress={handleInlineBannerButtonPress}
                              style={inlineBannerButtonStyle}
                            />
                          }
                          onClose={handleInlineBannerClosePress}
                          // style={styles.permissionWarningBannerContainer}
                          icon={<ContactIcon />}
                          title={t(
                            "InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.title"
                          )}
                          text={t(
                            "InternalTransfers.InternalTransferCroatiaToCroatiaScreen.permissionInlineBanner.description"
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
                label={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.email.email")}
                name="email"
                placeholder={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.email.placeholder")}
                testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:EmailInput"
              />
            ) : transferMethod === "IBAN" ? (
              <MaskedTextInput
                autoCapitalize="characters"
                control={control}
                label={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.iban.ibanLabel")}
                name="iban"
                mask={Masks.IBAN}
                testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:IBANInput"
              />
            ) : transferMethod === "nationalId" ? (
              <MaskedTextInput
                control={control}
                label={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.nationalID.label")}
                keyboardType="number-pad"
                mask={Masks.NATIONAL_ID}
                name="identifier"
                testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:NationalIDInput"
              />
            ) : null}
          </View>
        </Stack>
        <View style={viewContainerStyle}>
          <SubmitButton
            control={control}
            onSubmit={handleSubmit(handleOnSubmit)}
            testID="InternalTransfers.InternalTransferCroatiaToCroatiaScreen:ContinueButton">
            {t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.continue")}
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
              testID="CardActions.InternalTransferCroatiaToCroatiaScreen:ContactsPermissionModalConfirmButton">
              {t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.confirmationButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleOnContactsDeclineModalPress}
              testID="CardActions.InternalTransferCroatiaToCroatiaScreen:ContactsPermissionModalCancelButton">
              {t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.declineButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.title")}
        title={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.description")}
        isVisible={showPermissionConfirmationModal}
        testID="CardActions.InternalTransferCroatiaToCroatiaScreen:CardConfirmationModal"
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

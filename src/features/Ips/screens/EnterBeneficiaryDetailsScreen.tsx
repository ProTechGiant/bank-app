import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Linking, Platform, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as yup from "yup";

import { ContactIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
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
import { AccountBalanceIcon } from "@/features/CardActions/assets/icons";
import { InlineBanner } from "@/features/CardActions/components";
import InlineBannerButton from "@/features/CardActions/components/InlineBanner/InlineBannerButton";
import { SelectedContact } from "@/features/InternalTransfers/components";
import { useBeneficiaryBanks } from "@/features/InternalTransfers/hooks/query-hooks";
import { Contact } from "@/features/InternalTransfers/types";
import { formatContactNumberToSaudi } from "@/features/InternalTransfers/utils";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { ibanRegExp, numericRegExp, saudiPhoneRegExp } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import SelectBeneficiary from "../components/SelectBeneficiary";
import { IpsStackParams } from "../IpsStack";
import { RequestDetailsScreenTypeEnum } from "../type";

interface BeneficiaryInput {
  bankName: string;
  email?: string;
  iban?: string;
  identifier?: string;
  name?: string;
  phoneNumber?: string;
  transferMethod: "mobileNo" | "nationalId" | "IBAN" | "email" | "beneficiary";
}

export default function EnterBeneficiaryDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    params: { amount },
  } = useRoute<RouteProp<IpsStackParams, "IpsStack.EnterBeneficiaryDetails">>();

  const banks = useBeneficiaryBanks(); //TODO change this to the right API
  const contacts = useContacts();

  const bankOptions = useMemo(() => {
    if (banks.data === undefined) return [];

    return banks.data.Banks.map(element => ({
      label: element.EnglishName,
      value: element.EnglishName,
      icon: <AccountBalanceIcon />,
    }));
  }, [banks.data]);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        bankName: yup.string().required(),
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
      bankName: undefined,
      transferMethod: "beneficiary",
    },
  });

  const identifiers = [
    {
      label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.beneficiaries"),
      value: "beneficiary",
    },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.iban"), value: "IBAN" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.mobile"), value: "mobileNo" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.id"), value: "nationalId" },
    { label: t("InternalTransfers.EnterQuickTransferBeneficiaryScreen.transferByOptions.email"), value: "email" },
  ] as const;

  const transferMethod = watch("transferMethod");
  const bankName = watch("bankName");
  const iban = watch("iban");
  const name = watch("name");

  const [showPermissionConfirmationModal, setShowPermissionConfirmationModal] = useState<boolean>(false);
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const onContactPress = async () => {
    if (await contacts.isContactsPermissionGranted(Platform.OS)) {
      navigation.navigate("InternalTransfers.InternalTransfersStack", {
        screen: "InternalTransfers.ContactsScreen",
        params: {
          onContactSelected: handleOnContactSelected,
        },
      });
    } else {
      setShowPermissionConfirmationModal(true);
    }
  };

  const handleOnCancelSelectedContactsInfo = () => {
    setContact(undefined);
    setValue("phoneNumber", "");
  };

  const handleOnContactSelected = (selectedContact: Contact) => {
    setContact(selectedContact);
    setValue("phoneNumber", selectedContact.phoneNumber);
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
            setIsPermissionDenied(true);
          });
      }
    } catch (error) {
      warn("Contacts-Permissions-Status", "Could not get permission Status: ", JSON.stringify(error));
    }
  };

  const handleOnSubmitBeneficiary = (user: { BankName: string; Name?: string; IBAN?: string }) => {
    navigation.navigate("Ips.IpsStack", {
      screen: "IpsStack.RequestDetails",
      params: {
        IBAN: user.IBAN,
        amount: amount,
        bank: user.BankName,
        name: user.Name,
        type: RequestDetailsScreenTypeEnum.CONFIRM,
      },
    });
  };

  const handleOnSubmit = () => {
    handleOnSubmitBeneficiary({ BankName: bankName, IBAN: iban, Name: name });
  };

  const inlineBannerButtonStyle = useThemeStyles(theme => ({
    borderRadius: theme.spacing["24p"],
    borderWidth: 0.5,
  }));

  const transferMethodStyle = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
  }));

  const inlineBannerContainerStyle = useThemeStyles(theme => ({
    marginTop: theme.spacing["20p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    gap: theme.spacing["20p"],
  }));

  const submitButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    paddingBottom: theme.spacing["20p"],
    justifyContent: "flex-end",
  }));

  const fieldsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    paddingHorizontal: theme.spacing["20p"],
    gap: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton
        title="Payment Request"
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <Typography.Header style={contentContainerStyle} size="large">
        {t("InternalTransfers.EnterBeneficiaryDetailsScreen.title")}
      </Typography.Header>
      <View style={transferMethodStyle}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Stack direction="horizontal" gap="8p">
            {identifiers.map(element => (
              <Pill
                testID={`IPS.EnterQuickTransferBeneficiaryScreen:TransferMethodPill-${element.value}`}
                key={element.value}
                isActive={transferMethod === element.value}
                onPress={() => setValue("transferMethod", element.value, { shouldValidate: true })}>
                {element.label}
              </Pill>
            ))}
          </Stack>
        </ScrollView>
      </View>
      <View style={fieldsContainerStyle}>
        {transferMethod === "beneficiary" ? (
          <SelectBeneficiary onBeneficiaryPress={handleOnSubmitBeneficiary} />
        ) : transferMethod === "mobileNo" ? (
          <>
            {contact !== undefined ? (
              <SelectedContact
                fullName={contact.name}
                contactInfo={formatContactNumberToSaudi(contact.phoneNumber)}
                onCancelPress={handleOnCancelSelectedContactsInfo}
                testID="IPS.InternalTransferCTCAndCTAScreen"
              />
            ) : (
              <PhoneNumberInput
                value={getValues("phoneNumber")}
                onClear={() => {
                  setValue("phoneNumber", "");
                }}
                control={control}
                label="Mobile"
                name="phoneNumber"
                testID="IPS.EnterQuickTransferBeneficiaryScreen:PhoneNumberInput"
                onContactPress={onContactPress}
                onboarding={false}
              />
            )}
            {isPermissionDenied !== undefined && isPermissionDenied ? (
              <View style={inlineBannerContainerStyle}>
                <InlineBanner
                  action={
                    <InlineBannerButton
                      text={t(
                        "InternalTransfers.EnterBeneficiaryDetailsScreen.permissionInlineBanner.allowAccessbutton"
                      )}
                      onPress={onContactPress}
                      style={inlineBannerButtonStyle}
                    />
                  }
                  onClose={() => setIsPermissionDenied(false)}
                  icon={<ContactIcon />}
                  title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.permissionInlineBanner.title")}
                  text={t("InternalTransfers.EnterBeneficiaryDetailsScreen.permissionInlineBanner.description")}
                  testID="IPS.EnterBeneficiaryDetailsScreen:PermissionDeclineInlineBanner"
                />
              </View>
            ) : null}
          </>
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
            testID="IPS.EnterQuickTransferBeneficiaryScreen:EmailInput"
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
            testID="IPS.EnterQuickTransferBeneficiaryScreen:NationalIDInput"
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
              testID="IPS.EnterLocalTransferBeneficiaryScreen:FullNameInput"
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
              testID="IPS.EnterLocalTransferBeneficiaryScreen:IBANInput"
            />
          </Stack>
        ) : null}
        {transferMethod !== "beneficiary" ? (
          <DropdownInput
            autoselect={false}
            buttonLabel="Select Bank"
            control={control}
            isFixedHeight
            name="bankName"
            headerText="Choose Bank"
            options={bankOptions}
            label="Bank Name"
            placeholder="Bank Name"
            testID="IPS.EnterQuickTransferBeneficiaryScreen:BeneficiaryBankDropdown"
          />
        ) : null}
        <View style={[contentContainerStyle, submitButtonStyle]}>
          <SubmitButton isDisabled={false} control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            Continue
          </SubmitButton>
        </View>
      </View>

      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              onPress={handleOnContactsConfirmationModalPress}
              testID="IPS.EnterBeneficiaryDetailsScreen:ContactsPermissionModalConfirmButton">
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.confirmationModal.confirmationButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleOnContactsDeclineModalPress}
              testID="IPS.EnterBeneficiaryDetailsScreen:ContactsPermissionModalCancelButton">
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.confirmationModal.declineButton")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.EnterBeneficiaryDetailsScreen.confirmationModal.description")}
        title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.confirmationModal.title")}
        isVisible={showPermissionConfirmationModal}
        testID="CardActions.EnterBeneficiaryDetailsScreen:CardConfirmationModal"
      />
    </Page>
  );
}

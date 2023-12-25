import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";
import * as permissions from "react-native-permissions";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import QrCodeScanner from "@/components/QrCodeScanner";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import useContacts from "@/hooks/use-contacts";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { ibanRegExpForARB } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import {
  EnterBeneficiaryByAccountNumberForm,
  EnterBeneficiaryByIBANForm,
  EnterBeneficiaryByMobileForm,
  EnterBeneficiaryByNationalIDForm,
  SwitchToARBModal,
} from "../components";
import { useAddBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiary, AddBeneficiaryFormForwardRef, Contact } from "../types";

export default function EnterBeneficiaryDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const account = useCurrentAccount();

  const contacts = useContacts();
  const { setAddBeneficiary, setRecipient, addBeneficiary, setTransferType, transferType } =
    useInternalTransferContext();
  const addBeneficiaryAsync = useAddBeneficiary();

  const nationalIdFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const accountNumberFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const mobileFormRef = useRef<AddBeneficiaryFormForwardRef>(null);
  const ibanFormRef = useRef<AddBeneficiaryFormForwardRef>(null);

  const accountNumber = account.data?.accountNumber;

  const [isErrorMessageModalVisible, setIsErrorMessageModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isInUseErrorModalVisible, setIsInUseErrorModalVisible] = useState(false);
  const [isSwitchToARBModalVisible, setIsSwitchToARBModalVisible] = useState(false);
  const [showPermissionConfirmationModal, setShowPermissionConfirmationModal] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [activePillIndex, setActivePillIndex] = useState(0);
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [isQrErrorModalVisible, setIsQrErrorModalVisible] = useState(false);
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [i18nKey, setI18nKey] = useState<string | undefined>(undefined);

  const hideErrorModal = () => {
    setIsInUseErrorModalVisible(false);
    setIsErrorMessageModalVisible(false);
  };

  const handleOnQrPress = async () => {
    if (Platform.OS === "ios") {
      await permissions.check(permissions.PERMISSIONS.IOS.CAMERA).then(result => {
        if (result === "granted") {
          setIsQrVisible(true);
        } else {
          setIsPermissionModel(true);
        }
      });
    }
    if (Platform.OS === "android") {
      await permissions.check(permissions.PERMISSIONS.ANDROID.CAMERA).then(result => {
        if (result === "granted") {
          setIsQrVisible(true);
        } else {
          setIsPermissionModel(true);
        }
      });
    }
  };

  const handleOnPressPermissionAcccess = async () => {
    if (Platform.OS === "ios") {
      await request(PERMISSIONS.IOS.CAMERA).then(result => {
        if (result === "granted") {
          setIsQrVisible(true);
          setIsPermissionModel(false);
        }
      });
    }

    if (Platform.OS === "android") {
      await request(PERMISSIONS.ANDROID.CAMERA).then(result => {
        if (result === "granted") {
          setIsQrVisible(true);
          setIsPermissionModel(false);
        }
      });
    }
  };

  const handleOnSubmit = async (values: AddBeneficiary) => {
    hideErrorModal();

    // BeneficiaryType is required in order to differentiate between CRO and ARB transfers
    if (transferType === undefined) {
      throw new Error('Cannot create beneficiary without "transferType"');
    }

    //Adding this to check if IBAN is of ARB, because we are specifically told to add this on frontend.
    if (
      transferType === TransferType.InternalTransferAction &&
      values.SelectionType === "IBAN" &&
      values.SelectionValue.match(ibanRegExpForARB)
    ) {
      setIsSwitchToARBModalVisible(true);
      return;
    }

    try {
      const response = await addBeneficiaryAsync.mutateAsync({
        ...values,
        BeneficiaryName: values.beneficiaryNickname,
        BeneficiaryTransferType: transferType,
      });
      setAddBeneficiary({
        SelectionType: values.SelectionType,
        SelectionValue: values.SelectionValue,
      });

      setRecipient({
        accountName: response.Name,
        accountNumber: response.BankAccountNumber,
        iban: response.IBAN,
        phoneNumber: response.PhoneNumber,
        type: "new",
        beneficiaryId: response.BeneficiaryId,
      });

      navigation.navigate("InternalTransfers.ConfirmNewBeneficiaryScreen");
    } catch (error) {
      setAddBeneficiary({
        SelectionType: values.SelectionType,
        SelectionValue: "",
      });

      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_ACCOUNT_DOES_NOT_EXIST)) {
          values.SelectionType === "accountId"
            ? setI18nKey("accountNumberForm.accountNumberNotRecognisedModal")
            : values.SelectionType === "IBAN"
            ? setI18nKey("ibanForm.ibanNotRecognisedModal")
            : values.SelectionType === "nationalId"
            ? setI18nKey("nationalIdForm.mobileNotRecognisedModal")
            : setI18nKey("ibanForm.mobileNotRecognisedModal");
        }

        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_EXISTS)) {
          values.SelectionType === "accountId"
            ? setI18nKey("accountNumberForm.accountNumberInUseModal")
            : values.SelectionType === "IBAN"
            ? setI18nKey("ibanForm.ibanInUseModal")
            : values.SelectionType === "nationalId"
            ? setI18nKey("nationalIdForm.mobileNotRecognisedModal")
            : setI18nKey("mobileNumberForm.mobileInUseModal");
        }

        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_NOT_OF_ARB)) {
          values.SelectionType === "accountId"
            ? setI18nKey("accountNumberForm.accountNumberNotRecognisedModal")
            : setI18nKey("ibanForm.ibanNotRecognisedModal");
        }

        setIsErrorMessageModalVisible(true);
      }
      setIsGenericErrorModalVisible(true);
      warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
    }
  };

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

  const options = [
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.iban"),
      form: (
        <EnterBeneficiaryByIBANForm
          selectionType="IBAN"
          ref={ibanFormRef}
          onSubmit={handleOnSubmit}
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:EnterBeneficiaryByIBANForm"
        />
      ),
    },
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.nationalId"),
      form: (
        <EnterBeneficiaryByNationalIDForm
          selectionType="nationalId"
          ref={nationalIdFormRef}
          onSubmit={handleOnSubmit}
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:EnterBeneficiaryByNationalIdForm"
        />
      ),
    },
    ...(transferType !== TransferType.CroatiaToArbTransferAction
      ? [
          {
            title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.mobile"),
            form: (
              <EnterBeneficiaryByMobileForm
                selectionType="mobileNo"
                ref={mobileFormRef}
                onSubmit={handleOnSubmit}
                onCancelContactPress={handleOnCancelSelectedContactsInfo}
                onContactPress={handleOnContactsPressed}
                onBannerClosePress={() => setIsPermissionDenied(false)}
                isPermissionDenied={isPermissionDenied}
                contact={contact}
                testID="InternalTransfers.EnterBeneficiaryDetailsScreen:EnterBeneficiaryByMobileForm"
              />
            ),
          },
        ]
      : []),
    {
      title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.accountNumber"),
      form: (
        <EnterBeneficiaryByAccountNumberForm
          selectionType="accountId"
          ref={accountNumberFormRef}
          onSubmit={handleOnSubmit}
          showQrCodeScan={() => handleOnQrPress()}
          accountNumber={accountNumber}
          SelectionValue="SelectionValue"
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:EnterBeneficiaryByAccountNumberForm"
        />
      ),
    },
  ];

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

  const handleOnContactsDeclineModalPress = () => {
    setShowPermissionConfirmationModal(false);
    setIsPermissionDenied(true);
  };

  const handleOnErrorMessagedModalClose = () => {
    setI18nKey(undefined);
    setIsErrorMessageModalVisible(false);
  };

  const handleOnGenericErrorClose = () => {
    setIsGenericErrorModalVisible(false);
  };

  const handleOnSwitchToARB = () => {
    setIsSwitchToARBModalVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransferScreen", {
      ResetForm: true,
    });
  };

  const handleOnCancel = () => {
    setIsSwitchToARBModalVisible(false);
  };

  const handleOnInUseErrorModalClose = () => {
    if (addBeneficiary?.SelectionType === "mobileNo") {
      mobileFormRef.current?.reset();
    } else if (addBeneficiary?.SelectionType === "accountId") {
      accountNumberFormRef.current?.reset();
    } else if (addBeneficiary?.SelectionType === "IBAN") {
      ibanFormRef.current?.reset();
    } else if (addBeneficiary?.SelectionType === "nationalId") {
      nationalIdFormRef.current?.reset();
    }

    setIsInUseErrorModalVisible(false);
  };

  const formContainer = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 1,
    marginTop: theme.spacing["24p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.EnterBeneficiaryDetailsScreen.title")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:NavHeader"
        />
        <ContentContainer isScrollView style={styles.flex}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.subTitle")}
            </Typography.Text>
            <Stack direction="horizontal" gap="8p">
              {options.map((element, index) => (
                <Pill
                  testID={`InternalTransfers.EnterBeneficiaryDetailsScreen:TransferMethodPill-${element.title}`}
                  key={index}
                  isActive={index === activePillIndex}
                  onPress={() => {
                    hideErrorModal();
                    setActivePillIndex(index);
                  }}>
                  {element.title}
                </Pill>
              ))}
            </Stack>
          </Stack>
          <View style={formContainer}>{options[activePillIndex].form}</View>
        </ContentContainer>
      </Page>
      {i18nKey !== undefined ? (
        <>
          <NotificationModal
            title={t(`InternalTransfers.EnterBeneficiaryDetailsScreen.${i18nKey}.${"title"}`)}
            message={t(`InternalTransfers.EnterBeneficiaryDetailsScreen.${i18nKey}.message`)}
            isVisible={isErrorMessageModalVisible}
            variant="error"
            onClose={() => handleOnErrorMessagedModalClose()}
            testID={`InternalTransfers.EnterBeneficiaryDetailsScreen:ValidationErrorModal-${i18nKey}`}
          />
          <NotificationModal
            title={t(`InternalTransfers.EnterBeneficiaryDetailsScreen.${i18nKey}.title`)}
            message={t(`InternalTransfers.EnterBeneficiaryDetailsScreen.${i18nKey}.message`)}
            isVisible={isInUseErrorModalVisible}
            variant="warning"
            onClose={() => handleOnInUseErrorModalClose()}
            testID={`InternalTransfers.EnterBeneficiaryDetailsScreen:ValidationWarningModal-${i18nKey}`}
          />
        </>
      ) : null}
      <NotificationModal
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorModalVisible}
        variant="error"
        onClose={() => handleOnGenericErrorClose()}
        buttons={{
          primary: <Button onPress={() => handleOnGenericErrorClose()}>{t("errors.generic.button")}</Button>,
        }}
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:GenericErrorModal"
      />
      <SwitchToARBModal
        isVisible={isSwitchToARBModalVisible}
        onSwitchToARBPress={handleOnSwitchToARB}
        onCancelPress={handleOnCancel}
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:SwitchToARBModal"
      />

      {/** Contacts permission modal */}
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
        message={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.description")}
        title={t("InternalTransfers.InternalTransferCroatiaToCroatiaScreen.confirmationModal.title")}
        isVisible={showPermissionConfirmationModal}
        testID="CardActions.EnterBeneficiaryDetailsScreen:CardConfirmationModal"
      />
      <NotificationModal
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isQrErrorModalVisible}
        variant="error"
        onClose={() => setIsQrErrorModalVisible(false)}
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:QRGenericErrorModal"
      />
      <NotificationModal
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:CaameraPermissionModal"
        variant="warning"
        title={t("QrCodeScreen.permissionsModal.title")}
        message={t("QrCodeScreen.permissionsModal.message")}
        isVisible={isPermissionModal}
        onClose={() => setIsPermissionModal(false)}
        buttons={{
          primary: (
            <Button
              testID="InternalTransfers.EnterBeneficiaryDetailsScreen:AllowButton"
              onPress={() => handleOnPressPermissionAcccess()}>
              {t("QrCodeScreen.permissionsModal.button")}
            </Button>
          ),
          secondary: (
            <Button
              testID="InternalTransfers.EnterBeneficiaryDetailsScreen:CancelButton"
              onPress={() => setIsPermissionModal(false)}>
              {t("QrCodeScreen.permissionsModal.cancelButton")}
            </Button>
          ),
        }}
      />

      {isQrVisible ? (
        <QrCodeScanner
          onClose={() => setIsQrVisible(false)}
          onReadQR={res => {
            setIsQrVisible(false);
            accountNumberFormRef.current?.setValue("SelectionValue", res);
          }}
          onError={() => {
            setIsQrVisible(false);
            setIsQrErrorModalVisible(true);
          }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const ERROR_BENEFICIARY_EXISTS = "beneficiary already exists";
const ERROR_ACCOUNT_DOES_NOT_EXIST = "Account does not exist";
const ERROR_BENEFICIARY_NOT_OF_ARB = "doesn't match Bank - ARB";

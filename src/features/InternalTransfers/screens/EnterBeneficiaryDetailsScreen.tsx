import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ApiError from "@/api/ApiError";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { TransferType } from "@/types/InternalTransfer";
import { ibanRegExpForARB } from "@/utils";

import {
  EnterBeneficiaryByAccountNumberForm,
  EnterBeneficiaryByIBANForm,
  EnterBeneficiaryByMobileForm,
  SwitchToARBModal,
} from "../components";
import { useAddBeneficiary } from "../hooks/query-hooks";
import { AddBeneficiary } from "../types";

export default function EnterBeneficiaryDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { setAddBeneficiary, setRecipient, addBeneficiary, setTransferType, transferType } =
    useInternalTransferContext();
  const addBeneficiaryAsync = useAddBeneficiary();

  const accountNumberFormRef = useRef(null);
  const mobileFormRef = useRef(null);
  const ibanFormRef = useRef(null);

  const [isErrorMessageModalVisible, setIsErrorMessageModalVisible] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isInUseErrorModalVisible, setIsInUseErrorModalVisible] = useState(false);
  const [isSwitchToARBModalVisible, setIsSwitchToARBModalVisible] = useState(false);
  const [activePillIndex, setActivePillIndex] = useState(0);
  const [i18nKey, setI18nKey] = useState<string | undefined>(undefined);

  const hideErrorModal = () => {
    setIsInUseErrorModalVisible(false);
    setIsErrorMessageModalVisible(false);
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
            : setI18nKey("ibanForm.mobileNotRecognisedModal");
        }

        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_EXISTS)) {
          values.SelectionType === "accountId"
            ? setI18nKey("accountNumberForm.accountNumberInUseModal")
            : values.SelectionType === "IBAN"
            ? setI18nKey("ibanForm.ibanInUseModal")
            : setI18nKey("mobileNumberForm.mobileInUseModal");
        }

        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_NOT_OF_ARB)) {
          values.SelectionType === "accountId"
            ? setI18nKey("accountNumberForm.accountNumberNotRecognisedModal")
            : setI18nKey("ibanForm.ibanNotRecognisedModal");
        }

        setIsErrorMessageModalVisible(true);
      } else {
        setIsGenericErrorModalVisible(true);
      }

      warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
    }
  };

  const options = [
    ...(transferType !== TransferType.CroatiaToArbTransferAction
      ? [
          {
            title: t("InternalTransfers.EnterBeneficiaryDetailsScreen.options.mobile"),
            form: (
              <EnterBeneficiaryByMobileForm
                selectionType="mobileNo"
                ref={mobileFormRef}
                onSubmit={handleOnSubmit}
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
          testID="InternalTransfers.EnterBeneficiaryDetailsScreen:EnterBeneficiaryByAccountNumberForm"
        />
      ),
    },
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
  ];

  const handleOnErrorMessagedModalClose = () => {
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
        <NavHeader withBackButton testID="InternalTransfers.EnterBeneficiaryDetailsScreen:NavHeader" />
        <ContentContainer isScrollView style={styles.flex}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.EnterBeneficiaryDetailsScreen.title")}
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
            title={t(
              `InternalTransfers.EnterBeneficiaryDetailsScreen.${i18nKey}.${
                transferType === TransferType.InternalTransferAction ? "title" : "titleArb"
              }`
            )}
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
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:GenericErrorModal"
      />
      <SwitchToARBModal
        isVisible={isSwitchToARBModalVisible}
        onSwitchToARBPress={handleOnSwitchToARB}
        onCancelPress={handleOnCancel}
        testID="InternalTransfers.EnterBeneficiaryDetailsScreen:SwitchToARBModal"
      />
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

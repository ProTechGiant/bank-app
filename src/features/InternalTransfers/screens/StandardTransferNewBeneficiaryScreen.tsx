import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import MaskedTextInput from "@/components/Form/MaskedTextInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import { Masks } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { ibanRegExpForARB } from "@/utils";

import { SwitchToARBModal } from "../components";
import { useAddBeneficiaryLocalTranfer, useBankDetailWithIBAN, useBeneficiaryBanks } from "../hooks/query-hooks";
import { TransferType } from "../types";

interface BeneficiaryInput {
  iban: string;
  firstName: string;
  lastName: string;
}
export default function StandardTransferNewBeneficiaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const addBeneficiaryAsync = useAddBeneficiaryLocalTranfer();
  const bank = useBankDetailWithIBAN();
  const bankList = useBeneficiaryBanks();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup.string().required(t("InternalTransfers.NewBeneficiaryScreen.iban.validation.required")),
        lastName: yup.string().required(t("InternalTransfers.NewBeneficiaryScreen.iban.validation.required")),
        iban: yup
          .string()
          .required(t("InternalTransfers.NewBeneficiaryScreen.iban.validation.required"))
          .length(24, t("InternalTransfers.NewBeneficiaryScreen.iban.validation.lengthInvalid")),
      }),
    [t]
  );
  const { control, handleSubmit } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      iban: "",
    },
  });

  const [isIbanRecognized, setIsIbanRecognized] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [exsistingBeneficiaryModalVisible, setExistingBeneficiaryModalVisible] = useState(false);
  const [isSwitchToARBModalVisible, setIsSwitchToARBModalVisible] = useState(false);
  const { setRecipient, transferAmount, reason, transferType, setTransferType } = useInternalTransferContext();

  const handleOnSubmit = async (_values: BeneficiaryInput) => {
    Keyboard.dismiss();

    //Adding this to check if IBAN is of ARB, because we are specifically told to add this on frontend.
    if (_values.iban.match(ibanRegExpForARB)) {
      setIsSwitchToARBModalVisible(true);
      return;
    }

    const name = _values.firstName + " " + _values.lastName;
    try {
      const bankNameResponse = await bank.mutateAsync({ iban: _values.iban });
      const bankName = bankNameResponse.BankName;
      const selectedBank = bankList.data?.Banks.find(bankItem => bankItem.EnglishName === bankName);
      try {
        if (
          transferAmount === undefined ||
          reason === undefined ||
          selectedBank === undefined ||
          transferType === undefined
        )
          return;
        const values = {
          SelectionType: IBAN,
          SelectionValue: _values.iban,
          BeneficiaryName: name,
          BeneficiaryTransferType: BENEFICIARY_TYPE,
        };
        const response = await addBeneficiaryAsync.mutateAsync(values);
        if (response.Name === undefined || response.IBAN === undefined) return;

        setRecipient({
          accountName: response.Name,
          accountNumber: response.BankAccountNumber,
          iban: response.IBAN,
          phoneNumber: response.PhoneNumber,
          type: "new",
          beneficiaryId: response.BeneficiaryId,
        });

        navigation.navigate("InternalTransfers.ConfirmLocalTransferBeneficiaryScreen", {
          PaymentAmount: transferAmount,
          ReasonCode: reason,
          Beneficiary: {
            FullName: response.Name,
            Bank: selectedBank,
            SelectionType: IBAN,
            SelectionValue: response.IBAN,
            IBAN: response.IBAN,
            type: "new",
          },
        });
      } catch (error) {
        if (error instanceof ApiError && error.errorContent.Message.includes(ERROR_ACCOUNT_DOES_NOT_EXIST)) {
          setIsErrorModalVisible(true);
        } else if (error instanceof ApiError && error.errorContent.Message.includes(ERROR_BENEFICIARY_EXISTS)) {
          setRecipient({
            accountName: name,
            accountNumber: undefined,
            iban: IBAN,
            phoneNumber: undefined,
            type: "new",
          });
          setExistingBeneficiaryModalVisible(true);
        } else {
          setIsErrorModalVisible(true);
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.errorContent.Message.includes(ERROR_BANK_NOT_FOUND)) {
        setIsIbanRecognized(true);
      } else {
        setIsErrorModalVisible(true);
      }
    }
  };

  const handleOnSwitchToARB = () => {
    setIsSwitchToARBModalVisible(false);
    setTransferType(TransferType.CroatiaToArbTransferAction);
    navigation.navigate("InternalTransfers.InternalTransferScreen");
  };

  const handleOnCancel = () => {
    setIsSwitchToARBModalVisible(false);
  };

  const handleOnExistingBeneficiarySubmit = async () => {
    setExistingBeneficiaryModalVisible(false);
    navigation.goBack();
  };

  const formContainerStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader title={t("InternalTransfers.NewBeneficiaryScreen.navTitle")} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView keyboardShouldPersistTaps="always" style={styles.container}>
            <Stack align="stretch" direction="vertical" gap="20p" style={formContainerStyle}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.NewBeneficiaryScreen.title")}
              </Typography.Text>

              <Stack align="stretch" direction="vertical" gap="20p">
                <TextInput
                  control={control}
                  label={t("InternalTransfers.NewBeneficiaryScreen.firstName")}
                  name="firstName"
                  placeholder={t("InternalTransfers.NewBeneficiaryScreen.firstName")}
                />
                <TextInput
                  control={control}
                  label={t("InternalTransfers.NewBeneficiaryScreen.lastName")}
                  name="lastName"
                  placeholder={t("InternalTransfers.NewBeneficiaryScreen.lastName")}
                />
                <MaskedTextInput
                  autoCapitalize="characters"
                  control={control}
                  label={t("InternalTransfers.NewBeneficiaryScreen.IBANnumber")}
                  name="iban"
                  mask={Masks.IBAN}
                />
              </Stack>
            </Stack>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("InternalTransfers.NewBeneficiaryScreen.continue")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>
      <NotificationModal
        onClose={() => {
          setIsIbanRecognized(false);
        }}
        message={t("InternalTransfers.NewBeneficiaryScreen.iban.error.message")}
        title={t("InternalTransfers.NewBeneficiaryScreen.iban.error.title")}
        isVisible={isIbanRecognized}
        variant="error"
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.NewBeneficiaryScreen.ModalError.title")}
        message={t("InternalTransfers.NewBeneficiaryScreen.ModalError.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
      <NotificationModal
        onClose={() => {
          setExistingBeneficiaryModalVisible(false);
        }}
        variant="error"
        title={t("InternalTransfers.NewBeneficiaryScreen.ExistingBeneficiaryModal.title")}
        message={t("InternalTransfers.NewBeneficiaryScreen.ExistingBeneficiaryModal.message")}
        isVisible={exsistingBeneficiaryModalVisible}
        buttons={{
          primary: (
            <Button onPress={() => handleOnExistingBeneficiarySubmit()}>
              {t("InternalTransfers.NewBeneficiaryScreen.ExistingBeneficiaryModal.buttonText")}
            </Button>
          ),
        }}
      />
      <SwitchToARBModal
        isVisible={isSwitchToARBModalVisible}
        onSwitchToARBPress={handleOnSwitchToARB}
        onCancelPress={handleOnCancel}
      />
    </>
  );
}
const ERROR_BENEFICIARY_EXISTS = "beneficiary already exists";
const ERROR_ACCOUNT_DOES_NOT_EXIST = "Account does not exist";
const ERROR_BANK_NOT_FOUND = "This bank doesn't exist";
const BENEFICIARY_TYPE = "IPS_SARIE_TRANSFER";
const IBAN = "IBAN";
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  keyboard: {
    flex: 1,
  },
});

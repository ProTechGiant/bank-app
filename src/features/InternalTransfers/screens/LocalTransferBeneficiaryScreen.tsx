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
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { alphaRegExp, saudiPhoneRegExp } from "@/utils";

import { useAddLocalBeneficiary } from "../hooks/query-hooks";

interface BeneficiaryInput {
  iban?: string;
  beneficiaryNickname?: string;
}

export default function LocalTransferBeneficiaryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const addBeneficiaryAsync = useAddLocalBeneficiary();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        beneficiaryNickname: yup
          .string()
          .required()
          .matches(alphaRegExp, t("InternalTransfers.EditNickNameModalScreen.errorSpecialCharacter")),

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

  const { control, handleSubmit, setValue, getValues } = useForm<BeneficiaryInput>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      beneficiaryNickname: undefined,
      iban: undefined,
    },
  });

  const [showCloseModalModal, setShowCloseModalModal] = useState(false);
  const [isLocalTransferErrorVisible, setIsLocalTransferErrorVisible] = useState(false);
  const [isIbanErrorModalVisible, setIsIbanErrorModalVisible] = useState(false);

  const handleOnSubmit = async (values: BeneficiaryInput) => {
    Keyboard.dismiss();

    try {
      const response = await addBeneficiaryAsync.mutateAsync({
        SelectionValue: values.iban,
        BeneficiaryName: values.beneficiaryNickname,
      });

      //TOD0 :- need to add navigation
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorContent.Message.includes(ERROR_BENEFICIARY_DOESNOT_SUPPORT)) {
          setIsIbanErrorModalVisible(true);
        } else {
          setIsLocalTransferErrorVisible(true);
        }

        warn("Add Beneficiary", "Could not add beneficiary: ", JSON.stringify(error));
      }
    }
  };

  const handleErrorModal = () => {
    setIsLocalTransferErrorVisible(false);
  };

  const formContainerStyle = useThemeStyles(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("InternalTransfers.LocalTransferBeneficiaryScreen.navTitle")}
          testID="InternalTransfers.LocalTransferBeneficiaryScreen:NavHeader"
          end={<NavHeader.CloseEndButton onPress={() => setShowCloseModalModal(true)} />}
        />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
          <ContentContainer isScrollView keyboardShouldPersistTaps="always" style={styles.container}>
            <Stack align="stretch" direction="vertical" gap="20p" style={formContainerStyle}>
              <Typography.Text color="neutralBase+30" size="title1" weight="medium">
                {t("InternalTransfers.LocalTransferBeneficiaryScreen.subtitle")}
              </Typography.Text>
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
              <TextInput
                control={control}
                label={t("InternalTransfers.LocalTransferBeneficiaryScreen.nickname")}
                name="beneficiaryNickname"
                placeholder={t("InternalTransfers.LocalTransferBeneficiaryScreen.nickname")}
                testID="InternalTransfers.LocalTransferBeneficiaryScreen:NicknameInput"
                onClear={() => setValue("beneficiaryNickname", "")}
              />
            </Stack>
            <SubmitButton
              control={control}
              onSubmit={handleSubmit(handleOnSubmit)}
              testID="InternalTransfers.LocalTransferBeneficiaryScreen:ContinueButton">
              {t("InternalTransfers.LocalTransferBeneficiaryScreen.continue")}
            </SubmitButton>
          </ContentContainer>
        </KeyboardAvoidingView>
      </Page>

      <NotificationModal
        onClose={handleErrorModal}
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isLocalTransferErrorVisible}
        variant="error"
        testID="InternalTransfers.LocalTransferBeneficiaryScreen:ValidationErrorModal"
      />
      <NotificationModal
        onClose={() => setIsIbanErrorModalVisible(false)}
        message={t("InternalTransfers.LocalTransferBeneficiaryScreen.IbanModal.message")}
        title={t("InternalTransfers.LocalTransferBeneficiaryScreen.IbanModal.title")}
        isVisible={isIbanErrorModalVisible}
        variant="error"
        testID="InternalTransfers.LocalTransferBeneficiaryScreen:ValidationErrorModal"
      />

      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              onPress={() => navigation.goBack()}
              testID="InternalTransfers.LocalTransferBeneficiaryScreen:CancelTransationModalConfirmButton">
              {t("InternalTransfers.LocalTransferBeneficiaryScreen.CancelTransactionModal.confirm")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setShowCloseModalModal(false)}
              testID="InternalTransfers.LocalTransferBeneficiaryScreen:CancelTransationModalCancelButton">
              {t("InternalTransfers.LocalTransferBeneficiaryScreen.CancelTransactionModal.cancel")}
            </Button>
          ),
        }}
        message={t("InternalTransfers.LocalTransferBeneficiaryScreen.CancelTransactionModal.message")}
        title={t("InternalTransfers.LocalTransferBeneficiaryScreen.CancelTransactionModal.title")}
        isVisible={showCloseModalModal}
        testID="InternalTransfers.LocalTransferBeneficiaryScreen:CancelTransationModal"
      />
    </>
  );
}
const ERROR_BENEFICIARY_DOESNOT_SUPPORT = "User device not found";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  keyboard: {
    flex: 1,
  },
});

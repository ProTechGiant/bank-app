import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { BankAccountIcon, DeleteIcon, EditIcon, NicknameIcon, NumbersIcon, PersonFilledIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { useToasts } from "@/contexts/ToastsContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";
import { formatIban, getFirstName } from "@/utils";

import { ConfirmBeneficiaryListCard } from "../components";
import { useDeleteBeneficiary } from "../hooks/query-hooks";
import { TransfersType } from "../types";

export default function BeneficiaryProfileScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const { beneficiary } = useInternalTransferContext();
  const addToast = useToasts();

  const { mutateAsync: deleteBeneficiaryAsync, isLoading } = useDeleteBeneficiary();

  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isErrorMessageModalVisible, setIsErrorMessageModalVisible] = useState(false);
  const [showDeleteBeneficiaryConfirmationModal, setShowDeleteBeneficiaryConfirmationModal] = useState(false);

  const errorModalDismiss = () => {
    setIsGenericErrorModalVisible(false);
  };

  const handleOnSubmit = async () => {
    //TODO
  };

  const handleOnDelete = async () => {
    setShowDeleteBeneficiaryConfirmationModal(true);
  };

  const handleOndeleteBeneficiaryModalPress = async () => {
    try {
      await deleteBeneficiaryAsync({
        BeneficiaryId: beneficiary.beneficiaryId,
      });
      addToast({
        variant: "success",
        message: t("InternalTransfers.BeneficiaryProfileScreen.deleteBeneficiarySuccessToastMessage"),
        position: "top",
      });
      setShowDeleteBeneficiaryConfirmationModal(false);
      navigation.goBack();
    } catch (error) {
      setShowDeleteBeneficiaryConfirmationModal(false);
      setIsErrorMessageModalVisible(true);
    }
  };

  const handleOnCancelModalPress = () => {
    setShowDeleteBeneficiaryConfirmationModal(false);
  };

  const handleOnErrorMessagedModalClose = () => {
    setIsErrorMessageModalVisible(false);
  };

  const editNickNamePressHandle = () => {
    navigation.navigate("InternalTransfers.EditNickNameModalScreen");
  };

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const rightIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.extraSmall,
    marginTop: theme.spacing["24p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-50">
        <NavHeader
          withBackButton
          title={t("InternalTransfers.BeneficiaryProfileScreen.title")}
          testID="InternalTransfers.BeneficiaryProfileScreen:NavHeader"
        />
        <ContentContainer isScrollView style={styles.contentContainer}>
          <View>
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {getFirstName(beneficiary.FullName)} {t("InternalTransfers.BeneficiaryProfileScreen.accountText")}
            </Typography.Text>

            <Stack style={stackStyle} direction="vertical" align="stretch">
              <ConfirmBeneficiaryListCard
                icon={<PersonFilledIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.name")}
                label={beneficiary?.FullName || ""}
                testID="InternalTransfers.BeneficiaryProfileScreen:FullName"
              />
              <ConfirmBeneficiaryListCard
                icon={<BankAccountIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.bank")}
                label={i18n.language === "en" ? beneficiary?.BankName : beneficiary?.BankArabicName}
                //Need to be replaced once Arab bank name parameter recieved from BE
                testID="InternalTransfers.BeneficiaryProfileScreen:BankName"
              />
              <ConfirmBeneficiaryListCard
                icon={<NumbersIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.iban")}
                label={formatIban(beneficiary?.IBAN)}
                testID="InternalTransfers.BeneficiaryProfileScreen:IBAN"
              />
              {beneficiary.type === "INTERNAL_TRANSFER" || TransfersType.CROATIA_TO_ARB_TRANSFER ? (
                <ConfirmBeneficiaryListCard
                  isLastItem
                  icon={<NicknameIcon color={palette["neutralBase-40"]} />}
                  iconBackground="neutralBase-40"
                  rightIcon={<EditIcon color={rightIconColor} />}
                  caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.nickname")}
                  label={beneficiary.nickname}
                  testID="InternalTransfers.BeneficiaryProfileScreen:Nickname"
                  onPressRightIcon={editNickNamePressHandle}
                />
              ) : null}
            </Stack>
          </View>
          <View>
            <Button onPress={handleOnSubmit} testID="InternalTransfers.BeneficiaryProfileScreen:ConfirmButton">
              {beneficiary.active
                ? t("InternalTransfers.BeneficiaryProfileScreen.sendMoney")
                : t("InternalTransfers.BeneficiaryProfileScreen.activate")}
            </Button>
            <Button variant="warning" iconLeft={<DeleteIcon />} onPress={handleOnDelete}>
              {t("InternalTransfers.BeneficiaryProfileScreen.delete")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => setIsGenericErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={errorModalDismiss}>{t("errors.generic.button")}</Button>,
        }}
      />

      {/** delete beneficiary error modal */}
      <NotificationModal
        title={t("errors.generic.title")}
        message={t("errors.generic.tryAgainLater")}
        isVisible={isErrorMessageModalVisible}
        variant="error"
        onClose={handleOnErrorMessagedModalClose}
        testID="InternalTransfers.BeneficiaryProfileScreen:BeneficiaryDeletionError"
      />

      {/** delete beneficiary modal */}
      <NotificationModal
        variant="warning"
        buttons={{
          primary: (
            <Button
              loading={isLoading}
              onPress={handleOndeleteBeneficiaryModalPress}
              testID="InternalTransfers.BeneficiaryProfileScreen:DeleteBeneficiaryModalConfirmButton">
              {t("InternalTransfers.BeneficiaryProfileScreen.confirmationModal.confirmationButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={handleOnCancelModalPress}
              testID="InternalTransfers.BeneficiaryProfileScreen:DeleteBeneficiaryModalCancelButton">
              {t("InternalTransfers.BeneficiaryProfileScreen.confirmationModal.cancelButton")}
            </Button>
          ),
        }}
        message={
          beneficiary.active
            ? t("InternalTransfers.BeneficiaryProfileScreen.confirmationModal.descriptionActive")
            : t("InternalTransfers.BeneficiaryProfileScreen.confirmationModal.descriptionInactive")
        }
        title={t("InternalTransfers.BeneficiaryProfileScreen.confirmationModal.title")}
        isVisible={showDeleteBeneficiaryConfirmationModal}
        testID="InternalTransfers.BeneficiaryProfileScreen:CardConfirmationModal"
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});

import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { BankAccountIcon, DeleteIcon, EditIcon, NicknameIcon, NumbersIcon, PersonFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
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
  const addToast = useToasts();

  const { mutateAsync: deleteBeneficiaryAsync, isLoading } = useDeleteBeneficiary();

  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);
  const [isErrorMessageModalVisible, setIsErrorMessageModalVisible] = useState(false);
  const [showDeleteBeneficiaryConfirmationModal, setShowDeleteBeneficiaryConfirmationModal] = useState(false);

  const route = useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.BeneficiaryProfileScreen">>();

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
        BeneficiaryId: route.params.Beneficiary.beneficiaryId,
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

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const rightIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  const stackStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderRadius: theme.radii.extraSmall,
    marginTop: theme.spacing["24p"],
    borderColor: theme.palette["neutralBase-30"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
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
              {getFirstName(route.params.Beneficiary.FullName)}{" "}
              {t("InternalTransfers.BeneficiaryProfileScreen.accountText")}
            </Typography.Text>

            <Stack style={stackStyle} direction="vertical" align="stretch">
              <ConfirmBeneficiaryListCard
                icon={<PersonFilledIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.name")}
                label={route.params.Beneficiary.FullName || ""}
                testID="InternalTransfers.BeneficiaryProfileScreen:FullName"
              />
              <ConfirmBeneficiaryListCard
                icon={<BankAccountIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.bank")}
                label={i18n.language === "en" ? route.params.Beneficiary.BankName : route.params.Beneficiary.BankName}
                //Need to be replaced once Arab bank name parameter recieved from BE
                testID="InternalTransfers.BeneficiaryProfileScreen:BankName"
              />
              <ConfirmBeneficiaryListCard
                icon={<NumbersIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.iban")}
                label={formatIban(route.params.Beneficiary.IBAN)}
                testID="InternalTransfers.BeneficiaryProfileScreen:IBAN"
              />
              {route.params.Beneficiary.type === TransfersType.INTERNAL_TRANSFER ? (
                <ConfirmBeneficiaryListCard
                  isLastItem
                  icon={<NicknameIcon color={palette["neutralBase-40"]} />}
                  iconBackground="neutralBase-40"
                  rightIcon={<EditIcon color={rightIconColor} />}
                  caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.nickname")}
                  label={route.params.Beneficiary.nickname}
                  testID="InternalTransfers.BeneficiaryProfileScreen:Nickname"
                />
              ) : null}
            </Stack>
          </View>
          <View>
            {!route.params.Beneficiary.active ? (
              <Alert
                message={t("InternalTransfers.BeneficiaryProfileScreen.activateBeneficiaryText")}
                variant="default"
              />
            ) : null}
            <View style={buttonStyle}>
              <Button onPress={handleOnSubmit} testID="InternalTransfers.BeneficiaryProfileScreen:ConfirmButton">
                {route.params.Beneficiary.active
                  ? t("InternalTransfers.BeneficiaryProfileScreen.sendMoney")
                  : t("InternalTransfers.BeneficiaryProfileScreen.activate")}
              </Button>
              <Button variant="warning" iconLeft={<DeleteIcon />} onPress={handleOnDelete}>
                {t("InternalTransfers.BeneficiaryProfileScreen.delete")}
              </Button>
            </View>
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
          route.params.Beneficiary.active
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

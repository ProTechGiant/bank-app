import { RouteProp, useRoute } from "@react-navigation/native";
import { parsePhoneNumber } from "libphonenumber-js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BankAccountIcon, EmailIcon, NumbersIcon, PersonFilledIcon, PhoneFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import { warn } from "@/logger";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatIban } from "@/utils";
import delayTransition from "@/utils/delay-transition";

import { ConfirmBeneficiaryListCard } from "../components";
import { useFocalBeneficiaryStatus } from "../hooks/query-hooks";

export default function ConfirmLocalTransferBeneficiaryScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { recipient } = useInternalTransferContext();
  const { mutateAsync: getBeneficiaryFocalStatus } = useFocalBeneficiaryStatus();
  const [isBeneficiaryFocalStatus, setBeneficiaryFocalStatus] = useState(false);
  const [isGenericErrorModalVisible, setIsGenericErrorModalVisible] = useState(false);

  const route =
    useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ConfirmLocalTransferBeneficiaryScreen">>();

  const errorModalDismiss = () => {
    setBeneficiaryFocalStatus(false);
    setIsGenericErrorModalVisible(false);
  };

  const handleOnSubmit = async () => {
    try {
      const statusResponse = await getBeneficiaryFocalStatus({
        BeneficiaryId: recipient.beneficiaryId || "",
      });
      if (statusResponse?.Status?.toLowerCase() === "true") {
        if (recipient.type === "inactive" || recipient.type === "new") {
          return navigation.navigate("InternalTransfers.WaitingVerificationScreen");
        }
        navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", route.params);
      } else {
        setIsGenericErrorModalVisible(false);
        delayTransition(() => {
          setBeneficiaryFocalStatus(true);
        });
      }
    } catch (error) {
      warn("focal-beneficiary-status", "Focal beneficiary status throwing error: ", JSON.stringify(error));
      setBeneficiaryFocalStatus(false);
      delayTransition(() => {
        setIsGenericErrorModalVisible(true);
      });
    }
  };

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
    <>
      <Page backgroundColor="neutralBase-50">
        <NavHeader
          withBackButton
          title={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.navTitle")}
          testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:NavHeader"
        />
        <ContentContainer isScrollView style={styles.contentContainer}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.title")}
            </Typography.Text>
            <ConfirmBeneficiaryListCard
              icon={<PersonFilledIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.name")}
              label={route.params.Beneficiary.FullName}
              testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:FullName"
            />
            <ConfirmBeneficiaryListCard
              icon={<BankAccountIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.bank")}
              label={
                i18n.language === "en"
                  ? route.params.Beneficiary.Bank.EnglishName
                  : route.params.Beneficiary.Bank.ArabicName
              }
              testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:BankName"
            />
            {route.params.Beneficiary.SelectionType === "mobileNo" ? (
              <ConfirmBeneficiaryListCard
                icon={<PhoneFilledIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.mobile")}
                label={parsePhoneNumber(route.params.Beneficiary.SelectionValue).format("INTERNATIONAL")}
                testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:MobileNumber"
              />
            ) : route.params.Beneficiary.SelectionType === "IBAN" ? (
              <ConfirmBeneficiaryListCard
                icon={<NumbersIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.iban")}
                label={formatIban(route.params.Beneficiary.SelectionValue)}
                testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:IBAN"
              />
            ) : route.params.Beneficiary.SelectionType === "nationalId" ? (
              <ConfirmBeneficiaryListCard
                icon={<NumbersIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.id")}
                label={route.params.Beneficiary.SelectionValue}
                testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:NationalId"
              />
            ) : route.params.Beneficiary.SelectionType === "email" ? (
              <ConfirmBeneficiaryListCard
                icon={<EmailIcon color={iconColor} />}
                iconBackground="neutralBase-40"
                caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.email")}
                label={route.params.Beneficiary.SelectionValue}
                testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:Email"
              />
            ) : null}
            <Alert
              message={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.bannerMessage")}
              variant="default"
            />
          </Stack>
          <View>
            <Button
              onPress={handleOnSubmit}
              testID="InternalTransfers.ConfirmLocalTransferBeneficiaryScreen:ConfirmButton">
              {t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.confirmButton")}
            </Button>
          </View>
        </ContentContainer>
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isGenericErrorModalVisible}
        onClose={() => setIsGenericErrorModalVisible(false)}
        buttons={{
          primary: <Button onPress={errorModalDismiss}>{t("errors.generic.button")}</Button>,
        }}
      />
      <NotificationModal
        variant="error"
        title={t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.title")}
        message={t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.message")}
        isVisible={isBeneficiaryFocalStatus}
        onClose={() => setBeneficiaryFocalStatus(false)}
        buttons={{
          primary: (
            <Button onPress={errorModalDismiss}>
              {t("InternalTransfers.ConfirmNewBeneficiaryScreen.focalBeneficiaryError.ok")}
            </Button>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});

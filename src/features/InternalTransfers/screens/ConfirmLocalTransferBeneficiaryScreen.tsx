import { RouteProp, useRoute } from "@react-navigation/native";
import { parsePhoneNumber } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BankAccountIcon, EmailIcon, NumbersIcon, PersonFilledIcon, PhoneFilledIcon } from "@/assets/icons";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useInternalTransferContext } from "@/contexts/InternalTransfersContext";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatIban } from "@/utils";

import { ConfirmBeneficiaryListCard } from "../components";

export default function ConfirmLocalTransferBeneficiaryScreen() {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const { recipient } = useInternalTransferContext();

  const route =
    useRoute<RouteProp<AuthenticatedStackParams, "InternalTransfers.ConfirmLocalTransferBeneficiaryScreen">>();

  const handleOnSubmit = () => {
    if (recipient.type === "inactive" || recipient.type === "new") {
      return navigation.navigate("InternalTransfers.WaitingVerificationScreen");
    }
    navigation.navigate("InternalTransfers.ReviewLocalTransferScreen", route.params);
  };

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  return (
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
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
  },
});

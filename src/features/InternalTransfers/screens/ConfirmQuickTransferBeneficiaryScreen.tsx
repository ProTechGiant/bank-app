import { RouteProp, useRoute } from "@react-navigation/native";
import { parsePhoneNumber } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  BankAccountIcon,
  EmailIcon,
  InfoCircleIcon,
  NumbersIcon,
  PersonFilledIcon,
  PhoneFilledIcon,
} from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import InlineBanner from "@/components/InlineBanner";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import i18n from "@/i18n";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatIban } from "@/utils";

import { ConfirmBeneficiaryListCard } from "../components";

export default function ConfirmQuickTransferBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<MainStackParams, "InternalTransfers.ConfirmQuickTransferBeneficiaryScreen">>();

  const handleOnSubmit = () => {
    navigation.navigate("InternalTransfers.ReviewQuickTransferScreen", route.params);
  };

  const iconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);
  const infoIconColor = useThemeStyles(theme => theme.palette["neutralBase+10"]);

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader withBackButton title={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.navTitle")} />
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
          />
          {route.params.Beneficiary.SelectionType === "mobileNo" ? (
            <ConfirmBeneficiaryListCard
              icon={<PhoneFilledIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.mobile")}
              label={parsePhoneNumber(route.params.Beneficiary.SelectionValue).format("INTERNATIONAL")}
            />
          ) : route.params.Beneficiary.SelectionType === "IBAN" ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.iban")}
              label={formatIban(route.params.Beneficiary.SelectionValue)}
            />
          ) : route.params.Beneficiary.SelectionType === "nationalId" ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.id")}
              label={route.params.Beneficiary.SelectionValue}
            />
          ) : route.params.Beneficiary.SelectionType === "email" ? (
            <ConfirmBeneficiaryListCard
              icon={<EmailIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.email")}
              label={route.params.Beneficiary.SelectionValue}
            />
          ) : null}
          <InlineBanner
            icon={<InfoCircleIcon color={infoIconColor} />}
            text={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.bannerMessage")}
            variant="info"
          />
        </Stack>
        <View>
          <Button onPress={handleOnSubmit}>
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

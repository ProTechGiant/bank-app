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
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatIban } from "@/utils";

import { ConfirmBeneficiaryListCard } from "../components";

const recipient = {
  accountName: "Ibrahim Khan",
  bank: "Saudi National Bank",
  mobileNo: "+966 111 222 333",
  email: "john.doe@domain.com",
  IBAN: "1254452156246421",
  ID: "125r361237613",
};

export default function ConfirmQuickTransferBeneficiaryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // !TODO (AC2): show beneficiary details. where to get these from?
  const route = useRoute<RouteProp<MainStackParams, "InternalTransfers.ConfirmQuickTransferBeneficiaryScreen">>();

  const handleOnSubmit = () => {
    navigation.navigate("InternalTransfers.ReviewQuickTransferScreen");
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
            label={recipient.accountName}
          />
          <ConfirmBeneficiaryListCard
            icon={<BankAccountIcon color={iconColor} />}
            iconBackground="neutralBase-40"
            caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.bank")}
            label={recipient.bank}
          />
          {recipient.mobileNo !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<PhoneFilledIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.mobile")}
              label={parsePhoneNumber(recipient.mobileNo).format("INTERNATIONAL")}
            />
          ) : recipient.IBAN !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.iban")}
              label={formatIban(recipient.IBAN)}
            />
          ) : recipient.ID !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<NumbersIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.id")}
              label={formatIban(recipient.IBAN || "")}
            />
          ) : recipient.email !== undefined ? (
            <ConfirmBeneficiaryListCard
              icon={<EmailIcon color={iconColor} />}
              iconBackground="neutralBase-40"
              caption={t("InternalTransfers.ConfirmQuickTransferBeneficiaryScreen.details.email")}
              label={recipient.email}
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

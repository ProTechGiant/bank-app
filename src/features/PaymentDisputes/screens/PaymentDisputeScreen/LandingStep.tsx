import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { FlagIcon, ReportFraudIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { PhoneBook } from "@/hooks/use-call-support";
import { useThemeStyles } from "@/theme";

import { MoreHelp } from "../../components";

interface LandingStepProps {
  onProblemWithTransactionLink: () => void;
  onFraudLink: () => void;
  onClose: () => void;
}

export default function LandingStep({ onProblemWithTransactionLink, onFraudLink, onClose }: LandingStepProps) {
  const { t } = useTranslation();

  const linkCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const titleContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const moreHelpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <>
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={onClose} />} />
      <ContentContainer isScrollView style={styles.contentContainer}>
        <View style={titleContainerStyle}>
          <Typography.Text size="title1" weight="medium">
            {t("PaymentDisputes.PaymentDisputesLandingModal.title")}
          </Typography.Text>
        </View>
        <View style={linkCardContainerStyle}>
          <List isBordered>
            <List.Item.Primary
              label={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.scamLinkCardTitle")}
              helperText={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.scamLinkCardMessage")}
              end={<List.End.Chevron />}
              icon={<ReportFraudIcon />}
              onPress={onFraudLink}
            />
          </List>
        </View>
        <View style={linkCardContainerStyle}>
          <List isBordered>
            <List.Item.Primary
              label={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.disputeLinkCardTitle")}
              helperText={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.disputeLinkCardMessage")}
              end={<List.End.Chevron />}
              icon={<FlagIcon />}
              onPress={onProblemWithTransactionLink}
            />
          </List>
        </View>
        <Stack direction="vertical" gap="8p" style={moreHelpContainerStyle}>
          <Typography.Text size="title3" weight="medium">
            {t("PaymentDisputes.PaymentDisputesLandingModal.moreHelp.title")}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10" weight="regular">
            {t("PaymentDisputes.PaymentDisputesLandingModal.moreHelp.message")}
          </Typography.Text>
        </Stack>
        <MoreHelp phoneNumber={PhoneBook.CALL_US} />
      </ContentContainer>
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { FlagIcon, ReportFraudIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import CallBankFeedbackButton from "@/components/FeedbackButton/CallBankFeedbackButton";
import LiveChatFeedbackButton from "@/components/FeedbackButton/LiveChatFeedbackButton";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Stack from "@/components/Stack";
import { TableListCard } from "@/components/TableList";
import Typography from "@/components/Typography";
import { CALL_US } from "@/features/HelpAndSupport/constants";
import { mockHelpAndSupport } from "@/mocks/helpAndSupportData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface LandingStepProps {
  onProblemWithTransactionLink: () => void;
  onFraudLink: () => void;
}

const bankPhoneNumber =
  mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === CALL_US)?.ContentDescription ?? "";

export default function LandingStep({ onProblemWithTransactionLink, onFraudLink }: LandingStepProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isGenericErrorVisible, setIsGenericErrorVisible] = useState(false);

  const handleOnCloseGenericError = () => {
    setIsGenericErrorVisible(false);
    navigation.goBack();
  };

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
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      <ContentContainer>
        <View style={titleContainerStyle}>
          <Typography.Text size="title1" weight="medium">
            {t("PaymentDisputes.PaymentDisputesLandingModal.title")}
          </Typography.Text>
        </View>
        <View style={linkCardContainerStyle}>
          <TableListCard
            label={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.scamLinkCardTitle")}
            helperText={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.scamLinkCardMessage")}
            end={<TableListCard.Chevron />}
            icon={<ReportFraudIcon />}
            onPress={onFraudLink}
          />
        </View>
        <View style={linkCardContainerStyle}>
          <TableListCard
            label={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.disputeLinkCardTitle")}
            helperText={t("PaymentDisputes.PaymentDisputesLandingModal.linkCards.disputeLinkCardMessage")}
            end={<TableListCard.Chevron />}
            icon={<FlagIcon />}
            onPress={onProblemWithTransactionLink}
          />
        </View>
        <Stack direction="vertical" gap="8p" style={moreHelpContainerStyle}>
          <Typography.Text size="title3" weight="medium">
            {t("PaymentDisputes.PaymentDisputesLandingModal.moreHelp.title")}
          </Typography.Text>
          <Typography.Text size="footnote" color="neutralBase-10">
            {t("PaymentDisputes.PaymentDisputesLandingModal.moreHelp.message")}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" gap="12p">
          <CallBankFeedbackButton phoneNumber={bankPhoneNumber} />
          <LiveChatFeedbackButton />
        </Stack>
      </ContentContainer>
      <NotificationModal
        variant="error"
        isVisible={isGenericErrorVisible}
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        buttons={{
          primary: <Button onPress={handleOnCloseGenericError}>{t("errors.generic.button")}</Button>,
        }}
      />
    </>
  );
}

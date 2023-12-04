import { RouteProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View } from "react-native";
import { ViewStyle } from "react-native/types";

import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { PhoneBook } from "@/hooks/use-call-support";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { CaseStatusCard, CaseStatusRow, MoreHelp } from "../components";
import { useCaseDetails } from "../hooks/query-hooks";
import { formatDateTime } from "../utils";

export default function CaseDetailsScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "PaymentDisputes.CaseDetailsScreen">>();
  const { data, isError, refetch } = useCaseDetails(route.params.transactionRef);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setIsErrorModalVisible(isError);
  }, [isError]);

  const caseDetails = data;

  const moreHelpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["12p"],
    marginBottom: theme.spacing["24p"],
  }));

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
  }));

  const dateTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <>
      <Page backgroundColor="neutralBase-60">
        {caseDetails !== undefined ? (
          <>
            <NavHeader withBackButton={true} title={caseDetails.Transaction.Source} />
            <ContentContainer isScrollView>
              <Stack direction="vertical" gap="8p">
                <Typography.Text size="xlarge" weight="medium">
                  {formatCurrency(Number(caseDetails.Transaction.Amount), caseDetails.Transaction.Currency)}
                </Typography.Text>
                <Typography.Text size="callout" weight="regular" color="neutralBase+10" style={dateTextStyle}>
                  {formatDateTime(new Date(caseDetails.Transaction.CreatedOn))}
                </Typography.Text>
              </Stack>
              <CaseStatusRow status={caseDetails.CaseStatus} />
              <Typography.Text size="title3" weight="medium">
                {t("PaymentDisputes.CaseDetails.title")}
              </Typography.Text>
              <Stack direction="vertical" gap="8p" style={moreHelpContainerStyle}>
                <CaseStatusCard
                  description={format(new Date(caseDetails.OpenedDate), "d MMMM, yyyy")}
                  label={t("PaymentDisputes.CaseDetails.detailSection.dayReported")}
                />
                <CaseStatusCard
                  description={caseDetails.Issue}
                  label={t("PaymentDisputes.CaseDetails.detailSection.issue")}
                  hasIcon={true}
                />
                <CaseStatusCard
                  description={caseDetails.CaseNumber}
                  label={t("PaymentDisputes.CaseDetails.detailSection.caseId")}
                  hasIcon={true}
                />
                <CaseStatusCard
                  description={caseDetails.AdditionalInformation}
                  label={t("PaymentDisputes.CaseDetails.detailSection.additionalInformation")}
                  hasIcon={true}
                />
                <CaseStatusCard
                  description={caseDetails.DmsAttachment}
                  label={t("PaymentDisputes.CaseDetails.detailSection.attachment")}
                  isLast
                  hasIcon={true}
                />
              </Stack>
              <View style={dividerStyle}>
                <Divider color="neutralBase-40" height={4} />
              </View>
              <View style={moreHelpContainerStyle}>
                <Typography.Text size="title3" weight="medium">
                  {t("PaymentDisputes.PaymentDisputesLandingModal.moreHelp.title")}
                </Typography.Text>
              </View>
              <MoreHelp phoneNumber={PhoneBook.CALL_US} />
            </ContentContainer>
          </>
        ) : (
          <FullScreenLoader />
        )}
      </Page>
      <LoadingErrorNotification
        onClose={() => {
          setIsErrorModalVisible(false);
          navigation.goBack();
        }}
        onRefresh={() => {
          refetch();
          setIsErrorModalVisible(false);
        }}
        isVisible={isErrorModalVisible}
      />
    </>
  );
}

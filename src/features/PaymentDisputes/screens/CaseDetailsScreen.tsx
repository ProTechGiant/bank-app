import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, View } from "react-native";
import { ViewStyle } from "react-native/types";

import ContentContainer from "@/components/ContentContainer";
import Divider from "@/components/Divider";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { mockHelpAndSupport } from "@/mocks/helpAndSupportData";
import MainStackParams from "@/navigation/mainStackParams";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { CaseStatusCard, CaseStatusRow, MoreHelp } from "../components";
import { CALL_US } from "../constants";
import { useCaseDetails } from "../hooks/query-hooks";
import { formatDateTime } from "../utils";

export default function CaseDetailsScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<MainStackParams, "PaymentDisputes.CaseDetailsScreen">>();
  const caseDetailsResponse = useCaseDetails(route.params.transactionRef);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    setIsErrorModalVisible(caseDetailsResponse.isError);
  }, [caseDetailsResponse.isError]);

  const bankPhoneNumber =
    mockHelpAndSupport.ChildrenContents.find(item => item.ContentTag === CALL_US)?.ContentDescription ?? "";

  const caseDetails = caseDetailsResponse?.data;

  const moreHelpContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
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
              <Stack direction="vertical">
                <Typography.Text size="title1" weight="medium">
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
                  description={formatDateTime(new Date(caseDetails.OpenedDate))}
                  label={t("PaymentDisputes.CaseDetails.detailSection.dayReported")}
                />
                <CaseStatusCard
                  description={caseDetails.Issue}
                  label={t("PaymentDisputes.CaseDetails.detailSection.issue")}
                />
                <CaseStatusCard
                  description={caseDetails.CaseNumber}
                  label={t("PaymentDisputes.CaseDetails.detailSection.caseId")}
                />
                <CaseStatusCard
                  description={caseDetails.AdditionalInformation}
                  label={t("PaymentDisputes.CaseDetails.detailSection.additionalInformation")}
                />
                <CaseStatusCard
                  description={caseDetails.DmsAttachment}
                  label={t("PaymentDisputes.CaseDetails.detailSection.attachment")}
                  isLast
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
              <MoreHelp phoneNumber={bankPhoneNumber} />
            </ContentContainer>
          </>
        ) : (
          <FlexActivityIndicator />
        )}
      </Page>
      <LoadingErrorNotification
        onClose={() => setIsErrorModalVisible(false)}
        onRefresh={() => {
          caseDetailsResponse.refetch();
          setIsErrorModalVisible(false);
        }}
        isVisible={isErrorModalVisible}
      />
    </>
  );
}

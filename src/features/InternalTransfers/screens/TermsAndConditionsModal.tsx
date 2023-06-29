import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import TermsAndConditionDetails from "@/components/TermsAndConditionDetails";
import Typography from "@/components/Typography";
import { useContentTermsAndCondition } from "@/hooks/use-content";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useConfirmQuickTransferTermsAndConditions } from "../hooks/query-hooks";

export default function TermsAndConditionsModal() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const termsAndConditionData = useContentTermsAndCondition();
  const termsSections = termsAndConditionData?.data?.TermsSections;
  const submitTermsAndConditionAsync = useConfirmQuickTransferTermsAndConditions();
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  const handleOnAgreePress = async () => {
    try {
      const response = await submitTermsAndConditionAsync.mutateAsync({
        CustomerTermsConditionsFlag: "1",
      });

      if (response.CustomerTermsConditionsFlag === "1") {
        navigation.goBack();
        setTimeout(() => navigation.navigate("InternalTransfers.QuickTransferScreen"), 300);
      } else {
        setIsErrorModalVisible(true);
      }
    } catch (err) {
      setIsErrorModalVisible(true);
      warn("internal-transfers", "Could not process Agree Terms and conditions: ", JSON.stringify(err));
    }
  };

  const handleOnDisagreePress = async () => {
    try {
      const response = await submitTermsAndConditionAsync.mutateAsync({
        CustomerTermsConditionsFlag: "0",
      });

      if (response.CustomerTermsConditionsFlag === "0") {
        navigation.goBack();
      } else {
        setIsErrorModalVisible(true);
      }
    } catch (err) {
      setIsErrorModalVisible(true);
      warn("internal-transfers", "Could not process Agree Terms and conditions: ", JSON.stringify(err));
    }
  };

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-40"],
    marginHorizontal: -theme.spacing["20p"],
    marginVertical: theme.spacing["20p"],
  }));

  const agreeAndDisagreeContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["16p"],
  }));

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        {termsSections === undefined ? (
          <FlexActivityIndicator />
        ) : (
          <>
            <ContentContainer isScrollView>
              <View style={containerStyle}>
                <Typography.Text color="neutralBase+30" weight="medium" size="title1">
                  {t("InternalTransfers.BeneficiaryDeclarationScreen.title")}
                </Typography.Text>
              </View>
              {termsSections.map((term, index) => (
                <Typography.Text key={index} size="callout" color="primaryBase-40" weight="medium">
                  {`${index + 1}. ${term.Title}`}
                </Typography.Text>
              ))}
              <View style={separatorStyle} />
              {termsSections.map((term, index) => {
                return <TermsAndConditionDetails key={index} title={term.Title} data={term.Bodies} index={index + 1} />;
              })}
            </ContentContainer>
            <Stack direction="horizontal" style={agreeAndDisagreeContainerStyle} justify="space-between">
              <Pressable onPress={handleOnDisagreePress}>
                <Typography.Text color="primaryBase-40" size="body" weight="regular">
                  {t("LocalTransfers.LocalTransfersTermsAndConditions.disagree")}
                </Typography.Text>
              </Pressable>
              <Pressable onPress={handleOnAgreePress}>
                <Typography.Text color="primaryBase-40" size="body" weight="semiBold">
                  {t("LocalTransfers.LocalTransfersTermsAndConditions.agree")}
                </Typography.Text>
              </Pressable>
            </Stack>
          </>
        )}
      </Page>
      <NotificationModal
        variant="error"
        title={t("errors.generic.title")}
        message={t("errors.generic.message")}
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
      />
    </SafeAreaProvider>
  );
}

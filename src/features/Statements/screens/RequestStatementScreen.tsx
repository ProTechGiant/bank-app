import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import {
  SelectCustomDateModal,
  SelectCustomDatePeriodSection,
  SelectLanguageSection,
  SelectTimeFrameSection,
} from "../components";
import { StatementLanguageTypes } from "../constants";
import { useCreateCustomDateStatement, useGetCustomerOnboardingDate } from "../hooks/query-hooks";
import { TimeFrameInterface } from "../types";
import { isDateOlderThanThreeMonths, isDateValid } from "../utils";

interface CustomDatePeriodType {
  startDate: string | null;
  endDate: string | null;
}

export default function RequestStatementScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const [customDatePeriod, setCustomDatePeriod] = useState<CustomDatePeriodType>({ startDate: null, endDate: null });
  const [statementLanguage, setStatementLanguage] = useState<StatementLanguageTypes>(
    i18n.language.toUpperCase() as StatementLanguageTypes
  );
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrameInterface | null>(null);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState<boolean>(false); // This is how we will know if we are selecting start date or end date
  const [isCustomDateModalVisible, setIsCustomDateModalVisible] = useState<boolean>(false); // Modal for selecting the custom date period for both start date and end date
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });

  const { data: customerOnboardingDate } = useGetCustomerOnboardingDate();
  const { mutateAsync: createCustomDateStatementAsync, isLoading: isCreateCustomStatementApiLoading } =
    useCreateCustomDateStatement();

  const handleOnPressSetDate = (isStartDate: boolean) => {
    if (!isStartDate && !customDatePeriod.startDate) {
      // Here It's mean that user is selecting end Date before selecting the start date
      Alert.alert(t("Statements.RequestStatementScreen.selectStartDateFirst"));
      return;
    }
    setIsCustomDateModalVisible(true);
    setIsSelectingStartDate(isStartDate);
  };

  const handleOnPickDate = (isItStartDate: boolean, date: string) => {
    setSelectedTimeFrame(null);
    setIsCustomDateModalVisible(false);
    if (isItStartDate) {
      setCustomDatePeriod({
        startDate: date,
        endDate: isDateValid(date, customDatePeriod.endDate) ? customDatePeriod.endDate : null, // here in case of false it's mean that the difference between start date and end date is longer than the 2 years.
      });
    } else {
      setCustomDatePeriod({ ...customDatePeriod, endDate: date });
    }
  };

  const handleOnSelectTimeFrame = (timeFrame: TimeFrameInterface) => {
    // As we need to select just one time frame, so we need to reset the custom date period
    setCustomDatePeriod({ startDate: null, endDate: null });
    setSelectedTimeFrame(timeFrame);
  };

  const handleOnPressRequestStatement = async () => {
    if (!customerOnboardingDate?.OnboardingDate) {
      // Don't want to proceed ahead if we dont have onboarding date
      setIsNotificationModalVisible({ success: false, error: true });
      return;
    }

    try {
      const response = await createCustomDateStatementAsync({
        OnboardingDate: format(parseISO(customerOnboardingDate.OnboardingDate), "dd-MM-yyyy"),
        StatementLanguage: statementLanguage,
        ...(selectedTimeFrame
          ? { PredefinedTimeFrame: selectedTimeFrame.value }
          : customDatePeriod.startDate && customDatePeriod.endDate
          ? {
              StatementStartDate: format(parseISO(customDatePeriod.startDate), "dd-MM-yyyy"),
              StatementEndDate: format(parseISO(customDatePeriod.endDate), "dd-MM-yyyy"),
            }
          : {}),
      });

      if (response.StatementRequestId) {
        // Success Case Here
        setIsNotificationModalVisible({ success: true, error: false });
      } else {
        // Here mean something went wrong
        setIsNotificationModalVisible({ success: false, error: true });
      }
    } catch (err) {
      setIsNotificationModalVisible({ success: false, error: true });
    }
  };

  const handleOnCloseErrorNotificationModal = () => {
    // TODO: Will go back to monthly tab from here.
    setIsNotificationModalVisible({ success: false, error: false });
    navigation.goBack();
  };

  const handleOnCloseSuccessNotificationModal = () => {
    // TODO: Will go back to custom date tab from here.
    setIsNotificationModalVisible({ success: false, error: false });
    navigation.goBack();
  };

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-40"],
    height: 4,
  }));

  const bottomSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["16p"],
  }));

  const infoIconColor = useThemeStyles(theme => theme.palette.neutralBase);

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader
          title={t("Statements.RequestStatementScreen.title")}
          withBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <Stack direction="vertical" align="stretch" justify="space-between" flex={1}>
          <ScrollView>
            <SelectLanguageSection statementLanguage={statementLanguage} onChangeLanguage={setStatementLanguage} />
            <View style={sectionBreakerStyle} />

            {customerOnboardingDate?.OnboardingDate &&
            isDateOlderThanThreeMonths(customerOnboardingDate.OnboardingDate) ? (
              <SelectTimeFrameSection
                onSelectTimeFrame={handleOnSelectTimeFrame}
                selectedTimeFrame={selectedTimeFrame}
                onboardingDate={customerOnboardingDate.OnboardingDate}
              />
            ) : null}

            <SelectCustomDatePeriodSection
              startDate={customDatePeriod?.startDate}
              endDate={customDatePeriod?.endDate}
              onPressSetDate={handleOnPressSetDate}
            />
          </ScrollView>

          <Stack direction="vertical" style={bottomSectionStyle} align="stretch" gap="8p">
            <Button
              loading={isCreateCustomStatementApiLoading}
              onPress={handleOnPressRequestStatement}
              disabled={
                !(customDatePeriod.startDate !== null && customDatePeriod.endDate !== null) &&
                selectedTimeFrame === null
              }>
              {t("Statements.RequestStatementScreen.requestStatement")}
            </Button>
            <Stack direction="horizontal" align="center" justify="center" gap="4p">
              <InfoCircleIcon color={infoIconColor} />
              <Typography.Text size="caption1" weight="regular" color="neutralBase">
                {t("Statements.RequestStatementScreen.statementMightTakeFewMinute")}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>

        <NotificationModal
          isVisible={isNotificationModalVisible.error}
          message={t("Statements.RequestStatementScreen.pleaseTryAgain")}
          onClose={handleOnCloseErrorNotificationModal}
          title={t("Statements.RequestStatementScreen.weAreSorry")}
          variant="error"
        />
        <NotificationModal
          buttons={{
            primary: (
              <Button onPress={handleOnCloseSuccessNotificationModal}>
                {t("Statements.RequestStatementScreen.goBack")}
              </Button>
            ),
          }}
          isVisible={isNotificationModalVisible.success}
          message={t("Statements.RequestStatementScreen.statementRequestSuccessModalSubTitle")}
          title={t("Statements.RequestStatementScreen.statementRequestSuccessModal")}
          variant="success"
        />

        <SelectCustomDateModal
          isSelectingStartDate={isSelectingStartDate}
          startDate={customDatePeriod?.startDate}
          endDate={customDatePeriod?.endDate}
          onClose={() => setIsCustomDateModalVisible(false)}
          selectedDate={isSelectingStartDate ? customDatePeriod?.startDate || "" : customDatePeriod?.endDate || ""}
          visible={isCustomDateModalVisible}
          onPickDate={handleOnPickDate}
        />
      </Page>
    </SafeAreaProvider>
  );
}

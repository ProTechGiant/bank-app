import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import CurrencyInput from "@/components/Form/CurrencyInput";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { InfoCircleIcon } from "@/features/AllInOneCard/assets/icons";
import { TollIcon } from "@/features/GoldWallet/assets";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { DealStatusEnum, GoldFinalDealResponseType, TransactionTypeEnum } from "@/types/GoldTransactions";
import { formatCurrency } from "@/utils";

import { RecurringGoldModal } from "../components";
import { useAcceptGoldFinalDeal, useGoalGetterOTP } from "../hooks/query-hooks";

const MINIMUM_GOLD_PURCHASE = 5;

interface GoldAmount {
  initialContribution: number;
  recurringContribution: number;
}
export default function GoldPendingScreen() {
  //TODO change these values with the correct values
  const GOLD_TO_MONEY_RATION = 120;
  const WALLET_ID = "G10001";
  const TRANSACTION_TYPE = TransactionTypeEnum.BUY;

  const navigation = useNavigation();
  const { t } = useTranslation();
  const currentDate = new Date();

  const otpFlow = useOtpFlow();
  const { mutateAsync: acceptFinalDeal } = useAcceptGoldFinalDeal();
  const { mutateAsync: generateOtp } = useGoalGetterOTP();

  const [isRecurringModalVisible, setIsRecurringModalVisible] = useState<boolean>(false);
  const [recurringMaxLimit, setRecurringMaxLimit] = useState<number>(0);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("");
  const [recurringDay, setRecurringDay] = useState<string>("");
  const [recurringDate, setRecurringDate] = useState<Date>(currentDate);
  const isRecurringContinueButtonDisabled =
    recurringFrequency === ""
      ? true
      : (recurringFrequency === "001" && recurringDate === currentDate) ||
        (recurringFrequency === "002" && recurringDay === "");

  const validateContributionSchema = yup.object().shape({
    initialContribution: yup.number().nullable().min(MINIMUM_GOLD_PURCHASE),
    recurringContribution: yup.number().nullable().min(MINIMUM_GOLD_PURCHASE),
  });

  const {
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm<GoldAmount>({
    resolver: yupResolver(validateContributionSchema),
    mode: "onChange",
    defaultValues: { initialContribution: 0, recurringContribution: 0 },
  });

  const watchedValues = watch();

  const isContinueButtonDisabled = !(
    Object.keys(errors).length === 0 &&
    (watchedValues.initialContribution !== 0 || watchedValues.recurringContribution !== 0)
  );

  const navigateCollectSummaryScreen = () => {
    navigation.navigate("GoalGetter.CollectSummaryScreen", {
      walletId: WALLET_ID,
      transactionType: TransactionTypeEnum.BUY,
      weight: watchedValues.initialContribution,
      onDonePress: navigateToOtpFlow,
    });
  };

  const handleOnContinueButtonPress = () => {
    if (watchedValues.recurringContribution !== 0) {
      setIsRecurringModalVisible(true);
    } else if (watchedValues.initialContribution !== 0) {
      navigateCollectSummaryScreen();
    }
  };

  const handleOnRecurringModalSubmit = () => {
    setIsRecurringModalVisible(false);
    if (watchedValues.initialContribution !== 0) {
      setIsRecurringModalVisible(false);
      navigateCollectSummaryScreen();
    } else {
      navigateToOtpFlow(undefined);
    }
  };

  const navigateToOtpFlow = async (finalDealData: GoldFinalDealResponseType | undefined) => {
    try {
      if (finalDealData) {
        await acceptFinalDeal({
          ...finalDealData,
          Status: DealStatusEnum.ACCEPT,
          walletId: WALLET_ID,
          Type: TRANSACTION_TYPE,
        });
      }
      otpFlow.handle({
        action: {
          //TODO add the latest screen khalid made
          to: "GoalGetter.GoalDashboardScreen",
        },
        otpVerifyMethod: "goals/gold/submit",
        otpOptionalParams: {
          Type: TRANSACTION_TYPE,
          //TODO change this to the correct value once know it
          Collect: "Y",
          Recurring: {
            Amount: watchedValues.recurringContribution,
            UpperLimit: recurringMaxLimit,
            Date: recurringDay,
            EndDate: recurringDate,
          },
        },
        onOtpRequest: () => {
          return generateOtp();
        },
      });
    } catch (error) {}
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    justifyContent: "space-between",
    flex: 1,
  }));
  const inputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    minWidth: "100%",
  }));
  const inputStyle = useThemeStyles<ViewStyle>(theme => ({
    minWidth: "100%",
    gap: theme.spacing["12p"],
  }));
  const dropDownsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["20p"],
    width: "100%",
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader onBackPress={() => navigation.goBack()} title={t("GoalGetter.GoldPendingScreen.title")} />
      <KeyboardAvoidingView style={containerStyle}>
        <Stack direction="vertical" gap="8p" style={dropDownsContainerStyle}>
          <Typography.Text size="title1" weight="bold">
            {t("GoalGetter.GoldPendingScreen.setContribution")}
          </Typography.Text>
          <Typography.Text>{t("GoalGetter.GoldPendingScreen.enterInitialContribution")}</Typography.Text>
          <Stack direction="vertical" gap="24p" style={inputContainerStyle}>
            <View style={inputStyle}>
              <Typography.Text weight="bold">{t("GoalGetter.GoldPendingScreen.initialContribution")}</Typography.Text>
              <CurrencyInput control={control} currency="gram" name="initialContribution" label="" />
              <InfoBox
                variant="success"
                icon={<TollIcon />}
                title={` ${t("GoalGetter.GoldPendingScreen.convertedAmount")} ${formatCurrency(
                  getValues().initialContribution * GOLD_TO_MONEY_RATION,
                  "SAR"
                )}`}
              />
            </View>
            <InfoBox icon={<InfoCircleIcon />} title={t("GoalGetter.GoldPendingScreen.note")} variant="primary" />
            <View style={inputStyle}>
              <Typography.Text weight="bold">{t("GoalGetter.GoldPendingScreen.recurringContribution")}</Typography.Text>
              <CurrencyInput control={control} currency="gram" name="recurringContribution" label="" />
              <InfoBox
                variant="success"
                icon={<TollIcon />}
                title={` ${t("GoalGetter.GoldPendingScreen.convertedAmount")} ${formatCurrency(
                  getValues().recurringContribution * GOLD_TO_MONEY_RATION,
                  "SAR"
                )}`}
              />
            </View>
          </Stack>
        </Stack>
        <Stack direction="vertical" justify="center" align="center" gap="16p">
          <Button onPress={handleOnContinueButtonPress} disabled={isContinueButtonDisabled} block={true}>
            <Typography.Text color={isContinueButtonDisabled ? "neutralBase-20" : "neutralBase-60"}>
              {t("GoalGetter.GoldPendingScreen.continue")}
            </Typography.Text>
          </Button>
        </Stack>
      </KeyboardAvoidingView>
      <RecurringGoldModal
        isVisible={isRecurringModalVisible}
        maxLimit={recurringMaxLimit}
        recurringFrequency={recurringFrequency}
        recurringDate={recurringDate}
        recurringDay={recurringDay}
        isContinueButtonDisabled={isRecurringContinueButtonDisabled}
        setIsVisible={setIsRecurringModalVisible}
        setMaxLimit={setRecurringMaxLimit}
        setRecurringFrequency={setRecurringFrequency}
        setRecurringDate={setRecurringDate}
        setRecurringDay={setRecurringDay}
        onSubmit={handleOnRecurringModalSubmit}
      />
    </Page>
  );
}

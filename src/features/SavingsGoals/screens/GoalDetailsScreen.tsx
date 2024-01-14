import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ArrowCircleUpIcon, EditIcon, PlusIcon, RecurringEventIcon, WithdrawIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import ContextualFAQModal from "@/components/ContextualFAQModal";
import List from "@/components/List";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import ProgressWheel from "@/components/ProgressWheel";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import { useCurrentAccount } from "@/hooks/use-accounts";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import RoundUpsIcon from "../assets/round-ups";
import { TransactionCardList } from "../components";
import { calculateGoalBalanceOverThreeQuarters, getDayFromDate } from "../helpers";
import {
  useGetTransactionsByAccountId,
  useRecurringPayments,
  useRoundupFlag,
  useSavingsPot,
  useUpdateSavingsGoal,
} from "../hooks/query-hooks";

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const { PotId, amountWithdrawn, redirectToFundingModal } = route.params;

  const fundGoalModalShown = useRef(false);
  const { data: savingsPotData } = useSavingsPot(route.params.PotId);
  const { data: roundUpData } = useRoundupFlag();
  const updateSavingsGoalRoundUps = useUpdateSavingsGoal();
  const { data: getRecurringFund, isSuccess } = useRecurringPayments(route.params.PotId);
  const addToast = useToasts();

  const account = useCurrentAccount();
  const accountId = account.data?.id;

  const [isSwitchRoundupsModalVisible, setIsSwitchRoundupsModalVisible] = useState(false);
  const [showInfoRoundsUpsModal, setInfoRoundsUpModal] = useState(false);
  const [showGoalAlmostReachedNotification, setShowGoalAlmostReachedNotification] = useState(false);
  const [differenceNeededToReachGoal, setDifferenceNeededToReachGoal] = useState(0);
  const [showAmountWithdrawn, setShowAmountWithdrawn] = useState(amountWithdrawn);
  const [isRoundUpsOn, setIsRoundUpsOn] = useState(false);
  const recurringFundData = isSuccess ? getRecurringFund : undefined;
  const isGoalNotCompleted =
    Number(savingsPotData?.AvailableBalanceAmount ?? 0) <= Number(savingsPotData?.TargetAmount ?? 0);

  const { data: transactionsData, isLoading } = useGetTransactionsByAccountId({
    SavingGoalId: PotId,
    PageSize: 1000,
    PageNumber: 0,
    accountId,
  });

  // Immediately funding goal modal if needed
  useFocusEffect(
    useCallback(() => {
      if (redirectToFundingModal === true && !fundGoalModalShown.current) {
        navigation.navigate("SavingsGoals.FundGoalModal", {
          PotId,
          isFirstFunding: true,
        });

        // or else it'll be shown every time
        fundGoalModalShown.current = true;
      }

      if (amountWithdrawn) {
        setShowAmountWithdrawn(amountWithdrawn);
      }

      if (savingsPotData) {
        setIsRoundUpsOn(savingsPotData.RoundupFlag);
      }
    }, [redirectToFundingModal, amountWithdrawn, savingsPotData, navigation, PotId])
  );

  useEffect(() => {
    if (undefined === route.params) return;

    if (route.params.isRecurringPaymentRemoved === true) {
      addToast({
        variant: "confirm",
        message: t("SavingsGoals.EditRegularPaymentModal.removeBanner"),
      });
    }
  }, [navigation, route.params, t, addToast]);

  const handleOnBackPress = () => {
    if (route.params.redirectToFundingModal) navigation.navigate("SavingsGoals.SavingsGoalsScreen");
    else navigation.goBack();
  };

  const handleOnOpenFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId,
      step: "one-off-payment",
    });
  };

  const handleOnAddRecurringPaymentPress = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId,
      step: "recurring-payments",
    });
  };

  const handleOnUpdatePaymentPress = () => {
    navigation.navigate("SavingsGoals.EditRecurringPaymentModal", {
      PotId,
    });
  };

  const handleOnEdit = () => {
    navigation.navigate("SavingsGoals.EditGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnShowRoundupsInfoModal = () => {
    setInfoRoundsUpModal(!showInfoRoundsUpsModal);
  };

  const handleOnOpenWithdraw = () => {
    if (savingsPotData === undefined) return;

    const goalBalance = calculateGoalBalanceOverThreeQuarters(savingsPotData);

    setDifferenceNeededToReachGoal(goalBalance.difference);

    if (goalBalance.overThreeQuarters) {
      setShowGoalAlmostReachedNotification(true);
    } else {
      navigation.navigate("SavingsGoals.WithdrawGoalModal", { PotId });
    }
  };

  const handleWithdrawAnyway = () => {
    setShowGoalAlmostReachedNotification(false);

    navigation.navigate("SavingsGoals.WithdrawGoalModal", { PotId });
  };

  const handleOnCloseWithdrawConfirmationModal = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", { PotId });
  };

  const handleOnSeeAllTransactions = () => {
    navigation.navigate("SavingsGoals.AllTransactionsScreen", { PotId });
  };

  const handleOnToggleRoundUps = async () => {
    if (!savingsPotData || !roundUpData) return;

    const { IsRoundUpActive } = roundUpData;

    if (IsRoundUpActive === false) {
      // When all savings goals have round-ups disabled, enable without showing the modal
      await updateRoundUpFlag(true);
      setIsRoundUpsOn(true);
    } else if (!isRoundUpsOn) {
      // When round-ups already enabled, show the modal
      setIsSwitchRoundupsModalVisible(true);
    } else {
      setIsRoundUpsOn(false);
      await updateRoundUpFlag(false);
    }
  };

  const updateRoundUpFlag = async (flagValue: boolean) => {
    if (!savingsPotData) return;

    const { GoalName, TargetAmount, TargetDate, NotificationFlag } = savingsPotData;

    try {
      const response = await updateSavingsGoalRoundUps.mutateAsync({
        PotId,
        GoalName,
        TargetAmount,
        TargetDate,
        NotificationFlag,
        RoundupFlag: flagValue,
      });

      setIsRoundUpsOn(response.RoundupFlag ?? false);
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.navigate("SavingsGoals.SavingsGoalsScreen"),
        },
      ]);
    }
  };

  const handleOnSwitchRoundUpButton = async () => {
    await updateRoundUpFlag(true);
    setIsRoundUpsOn(true);
    setIsSwitchRoundupsModalVisible(false);
  };

  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing["16p"],
  }));

  const sectionTitleMargin = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const goalAmountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["4p"],
    flexDirection: "row",
    alignItems: "flex-end",
    // width of "SAR" plus the margin-left it has relative to the amount
    paddingLeft: theme.typography.text.sizes.body * 2 + styles.currency.marginLeft,
  }));

  const headerContentStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerProgressInfoStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  const backgroundBottomColor = useThemeStyles<string>(
    theme => (isGoalNotCompleted ? theme.palette["primaryBase-70"] : theme.palette["secondary_mintBase-10"]),
    [isGoalNotCompleted]
  );

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"] + theme.spacing["24p"], // calculation to account for angled background on header content
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom"]}>
      <NavHeader
        onBackPress={handleOnBackPress}
        title={savingsPotData?.GoalName}
        variant="angled"
        end={<NavHeader.IconEndButton icon={<EditIcon />} onPress={handleOnEdit} />}
        backgroundAngledColor={backgroundBottomColor}
        testID="SavingsGoals.GoalDetailsScreen:NavHeader">
        <View style={headerContentStyle}>
          <ProgressWheel
            circleSize={120}
            current={Number(savingsPotData?.AvailableBalanceAmount ?? 0)}
            total={Number(savingsPotData?.TargetAmount ?? 0)}
            textColor="neutralBase+30"
            textSize="title2"
            bigCheckIcon={true}
          />
          <View style={goalAmountStyle}>
            <Typography.Header
              size="xxlarge"
              weight="medium"
              testID="SavingsGoals.GoalDetailsScreen:AvailableBalanceAmount">
              {formatCurrency(Number(savingsPotData?.AvailableBalanceAmount ?? 0))}
            </Typography.Header>
            <Typography.Text size="title3" weight="medium" style={styles.currency}>
              {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.currency")}
            </Typography.Text>
          </View>
          <Stack align="center" direction="vertical" gap="24p" style={headerProgressInfoStyle}>
            <Typography.Text size="callout" align="center" testID="SavingsGoals.GoalDetailsScreen:TargetAmount">
              {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetAmountDetails", {
                TargetAmount: formatCurrency(Number(savingsPotData?.TargetAmount ?? 0)),
              })}
            </Typography.Text>
            <Typography.Text
              size="footnote"
              color="neutralBase+20"
              align="center"
              testID="SavingsGoals.GoalDetailsScreen:TargetDate">
              {savingsPotData?.TargetDate !== undefined
                ? t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetDate", {
                    TargetDate: format(new Date(savingsPotData?.TargetDate), "d MMM yyyy"),
                  })
                : "-"}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" gap="12p" justify="space-between">
            <Button
              onPress={handleOnOpenWithdraw}
              variant="secondary"
              iconLeft={<WithdrawIcon />}
              testID="SavingsGoals.GoalDetailsScreen:WithdrawButton">
              {t("SavingsGoals.GoalDetailsScreen.ActionButtons.withdrawButton")}
            </Button>
            <Button
              variant="primary"
              onPress={handleOnOpenFunding}
              iconLeft={<PlusIcon />}
              testID="SavingsGoals.GoalDetailsScreen:AddMoneyButton">
              {t("SavingsGoals.GoalDetailsScreen.ActionButtons.addMoneyButton")}
            </Button>
          </Stack>
        </View>
      </NavHeader>
      <ContentContainer isScrollView style={contentContainerStyle}>
        <Stack align="stretch" direction="vertical" gap="32p">
          <View>
            <View style={sectionTitleStyle}>
              <Typography.Text size="callout" weight="medium">
                {t("SavingsGoals.GoalDetailsScreen.Payments.title")}
              </Typography.Text>
            </View>
            <List gap="12p">
              <List.Item.Primary
                icon={<ArrowCircleUpIcon />}
                onMoreInfoPress={handleOnShowRoundupsInfoModal}
                label={t("SavingsGoals.GoalDetailsScreen.RoundUp")}
                end={
                  <List.End.Toggle
                    onPress={handleOnToggleRoundUps}
                    value={isRoundUpsOn}
                    testID="SavingsGoals.GoalDetailsScreen:SwitchRoundUpToggle"
                  />
                }
              />
              {recurringFundData !== undefined ? (
                <List.Item.Primary
                  onPress={handleOnUpdatePaymentPress}
                  label={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleExistingRegular")}
                  icon={<RecurringEventIcon />}
                  end={<List.End.Chevron />}
                  helperText={t("SavingsGoals.GoalDetailsScreen.RegularPayment.text", {
                    amount: recurringFundData.PaymentAmount,
                    currency: recurringFundData.Currency,
                    day: t("SavingsGoals.GoalDetailsScreen.RegularPayment.day", {
                      count: getDayFromDate(recurringFundData.NextPaymentDate),
                      ordinal: true,
                    }),
                  })}
                />
              ) : (
                <List.Item.Primary
                  onPress={handleOnAddRecurringPaymentPress}
                  icon={<RecurringEventIcon />}
                  label={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleAddRegular")}
                  end={<List.End.Chevron />}
                />
              )}
            </List>
          </View>
          <View style={sectionTitleMargin}>
            <View style={sectionTitleStyle}>
              <Typography.Text size="callout" weight="medium">
                {t("SavingsGoals.GoalDetailsScreen.Transactions.title")}
              </Typography.Text>
              {!isLoading && transactionsData?.Transaction?.length > 2 ? (
                <Pressable
                  onPress={handleOnSeeAllTransactions}
                  testID="SavingsGoals.GoalDetailsScreen:TransactionsButton">
                  <Typography.Text size="callout" weight="medium" color="primaryBase">
                    {t("SavingsGoals.GoalDetailsScreen.Transactions.seeAll")}
                  </Typography.Text>
                </Pressable>
              ) : null}
            </View>
            {!isLoading ? <TransactionCardList transactions={transactionsData?.Transaction ?? []} /> : null}
          </View>
        </Stack>
      </ContentContainer>
      {/* modal informing the user that the withdrawal was successful */}
      <NotificationModal
        variant="success"
        onClose={handleOnCloseWithdrawConfirmationModal}
        message={t("SavingsGoals.WithdrawModal.successfulWithdrawal.text")}
        title={t("SavingsGoals.WithdrawModal.successfulWithdrawal.title", { amount: showAmountWithdrawn })}
        isVisible={undefined !== amountWithdrawn}
      />
      {/* modal informing the user that he almost reached his goal when trying to withdraw */}
      {showGoalAlmostReachedNotification && (
        <NotificationModal
          variant="confirmations"
          message={t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.message", {
            amount: differenceNeededToReachGoal,
          })}
          title={t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.title")}
          isVisible={showGoalAlmostReachedNotification}
          buttons={{
            primary: (
              <Button onPress={handleWithdrawAnyway} testID="SavingsGoals.GoalDetailsScreen:WithdrawAnywayButton">
                {t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.withdrawButton")}
              </Button>
            ),
            secondary: (
              <Button
                onPress={() => setShowGoalAlmostReachedNotification(current => !current)}
                testID="SavingsGoals.GoalDetailsScreen:DontWithdrawButton">
                {t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.cancelButton")}
              </Button>
            ),
          }}
        />
      )}
      {/* modal informing the user that round-ups is active for another goal already */}
      <NotificationModal
        variant="confirmations"
        icon={<RoundUpsIcon />}
        message={t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.message")}
        title={t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.title")}
        isVisible={isSwitchRoundupsModalVisible}
        buttons={{
          primary: (
            <Button onPress={handleOnSwitchRoundUpButton} testID="SavingsGoals.GoalDetailsScreen:SwitchRoundUpButton">
              {t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.switchRoundUpButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => setIsSwitchRoundupsModalVisible(current => !current)}
              testID="SavingsGoals.GoalDetailsScreen:CancelRoundUpButton">
              {t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.cancelButton")}
            </Button>
          ),
        }}
      />

      {/* modal with information about rounds up */}
      {/* @TODO put in correct FAQ id */}
      <ContextualFAQModal
        visible={showInfoRoundsUpsModal}
        onClose={() => setInfoRoundsUpModal(!showInfoRoundsUpsModal)}
        title={t("SavingsGoals.GoalDetailsScreen.InfoModal.title")}
        content={t("SavingsGoals.GoalDetailsScreen.InfoModal.text")}
        faqId="faq_1"
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  currency: {
    marginBottom: 8,
    marginLeft: 4,
    position: "relative",
  },
});

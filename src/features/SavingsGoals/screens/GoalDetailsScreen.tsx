import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { EditIcon, LightningBoltIcon, PlusIcon, RecurringEventIcon, WithdrawIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import ContextualFAQModal from "@/components/ContextualFAQModal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import { useToasts } from "@/contexts/ToastsContext";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import HeaderBackground from "../assets/HeaderBackground";
import { ProgressWheel, TransactionCardList } from "../components";
import { calculateGoalBalanceOverThreeQuarters } from "../helpers";
import { useRecurringPayments, useRoundupFlag, useSavingsPot, useUpdateSavingsGoal } from "../hooks/query-hooks";

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const { PotId, amountWithdrawn, redirectToFundingModal } = route.params;

  const fundGoalModalShown = useRef(false);
  const { data: savingsPotData } = useSavingsPot(route.params.PotId);
  const { data: roundUpData } = useRoundupFlag();
  const updateSavingsGoalRoundUps = useUpdateSavingsGoal();
  const { data: getRecurringFund, isSuccess } = useRecurringPayments(route.params.PotId);
  const addToast = useToasts();

  const [isSwitchRoundupsModalVisible, setIsSwitchRoundupsModalVisible] = useState(false);
  const [showInfoRoundsUpsModal, setInfoRoundsUpModal] = useState(false);
  const [showGoalAlmostReachedNotification, setShowGoalAlmostReachedNotification] = useState(false);
  const [differenceNeededToReachGoal, setDifferenceNeededToReachGoal] = useState(0);
  const [showAmountWithdrawn, setShowAmountWithdrawn] = useState(amountWithdrawn);
  const [isRoundUpsOn, setIsRoundUpsOn] = useState(false);
  const recurringFundData = isSuccess ? getRecurringFund : undefined;
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

    setShowGoalAlmostReachedNotification(false);
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
    // TODO: navigate to "All Transactions" page or open new modal showing them, TBD
    console.log("All transactions");
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
    marginBottom: theme.spacing["8p"],
  }));

  const goalAmountStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["20p"],
    flexDirection: "row",
    // width of "SAR" plus the margin-left it has relative to the amount
    paddingLeft: theme.typography.text.sizes.body * 2 + styles.currency.marginLeft,
  }));

  const headerContentStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingHorizontal: theme.spacing["20p"],
  }));

  const headerProgressInfoStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.background}>
          <HeaderBackground deviceWidth={deviceWidth} scaleFactor={scaleFactor} scaledHeight={scaledHeight} />
        </View>
        <SafeAreaView style={styles.header}>
          <NavHeader
            onBackPress={handleOnBackPress}
            title={savingsPotData?.GoalName}
            variant="white"
            end={<NavHeader.IconEndButton icon={<EditIcon />} onPress={handleOnEdit} />}
          />
          <View style={headerContentStyle}>
            <ProgressWheel
              circleSize={128}
              current={Number(savingsPotData?.AvailableBalanceAmount ?? 0)}
              total={Number(savingsPotData?.TargetAmount ?? 0)}
              textColor="neutralBase-60"
              textSize="title2"
              bigCheckIcon={true}
            />
            <View style={goalAmountStyle}>
              <Typography.Header size="large" weight="medium" color="neutralBase-60">
                {formatCurrency(Number(savingsPotData?.AvailableBalanceAmount ?? 0))}
              </Typography.Header>
              <Typography.Text color="primaryBase-40" size="callout" weight="medium" style={styles.currency}>
                {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.currency")}
              </Typography.Text>
            </View>
            <Stack align="center" direction="vertical" gap="24p" style={headerProgressInfoStyle}>
              <Typography.Text size="callout" weight="medium" color="neutralBase-50" align="center">
                {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetAmountDetails", {
                  targetAmount: formatCurrency(Number(savingsPotData?.TargetAmount ?? 0), "SAR"),
                })}
              </Typography.Text>
              <Typography.Text size="footnote" weight="medium" color="neutralBase-10" align="center">
                {savingsPotData?.TargetDate !== undefined
                  ? t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetDate", {
                      TargetDate: format(new Date(savingsPotData?.TargetDate), "d MMM yyyy"),
                    })
                  : "-"}
              </Typography.Text>
            </Stack>
            <Stack direction="horizontal" gap="12p" justify="space-between">
              <View style={styles.button}>
                <Button color="dark" onPress={handleOnOpenWithdraw} variant="secondary" iconLeft={<WithdrawIcon />}>
                  {t("SavingsGoals.GoalDetailsScreen.ActionButtons.withdrawButton")}
                </Button>
              </View>
              <View style={styles.button}>
                <Button
                  variant="primary"
                  color="dark"
                  onPress={handleOnOpenFunding}
                  iconLeft={<PlusIcon width={19} height={20} />}>
                  {t("SavingsGoals.GoalDetailsScreen.ActionButtons.addMoneyButton")}
                </Button>
              </View>
            </Stack>
          </View>
        </SafeAreaView>
        <ContentContainer isScrollView>
          <Stack align="stretch" direction="vertical" gap="32p">
            <View>
              <View style={sectionTitleStyle}>
                <Typography.Text size="callout" weight="medium">
                  {t("SavingsGoals.GoalDetailsScreen.Payments.title")}
                </Typography.Text>
              </View>
              <TableListCardGroup>
                <TableListCard
                  icon={<LightningBoltIcon />}
                  onInfoPress={handleOnShowRoundupsInfoModal}
                  label={t("SavingsGoals.GoalDetailsScreen.RoundUp")}
                  end={<TableListCard.Toggle onPress={handleOnToggleRoundUps} value={isRoundUpsOn} />}
                />
                {recurringFundData !== undefined ? (
                  <TableListCard
                    onPress={handleOnUpdatePaymentPress}
                    label={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleExistingRegular")}
                    icon={<RecurringEventIcon />}
                    end={<TableListCard.Chevron />}
                    helperText={t("SavingsGoals.GoalDetailsScreen.RegularPayment.text", {
                      amount: recurringFundData.PaymentAmount,
                      currency: recurringFundData.Currency,
                      //Currently CBS doesn't return "next payment date" or a date at all, this is being worked on right now and is a known bug, was told to push forward.
                      // day: t("SavingsGoals.GoalDetailsScreen.RegularPayment.day", {
                      //   count: getDayFromDate(recurringFundData.NextPaymentDate),
                      //   ordinal: true,
                      // }),
                    })}
                  />
                ) : (
                  <TableListCard
                    onPress={handleOnAddRecurringPaymentPress}
                    icon={<RecurringEventIcon />}
                    label={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleAddRegular")}
                    end={<TableListCard.Chevron />}
                  />
                )}
              </TableListCardGroup>
            </View>
            <View>
              <View style={sectionTitleStyle}>
                <Typography.Text size="callout" weight="medium">
                  {t("SavingsGoals.GoalDetailsScreen.Transactions.title")}
                </Typography.Text>
                <Pressable onPress={handleOnSeeAllTransactions}>
                  <Typography.Text size="callout" weight="medium" color="primaryBase">
                    {t("SavingsGoals.GoalDetailsScreen.Transactions.seeAll")}
                  </Typography.Text>
                </Pressable>
              </View>
              <TransactionCardList />
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
                <Button onPress={handleWithdrawAnyway}>
                  {t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.withdrawButton")}
                </Button>
              ),
              secondary: (
                <Button onPress={() => setShowGoalAlmostReachedNotification(current => !current)}>
                  {t("SavingsGoals.GoalDetailsScreen.GoalAlmostReachedModal.cancelButton")}
                </Button>
              ),
            }}
          />
        )}
        {/* modal informing the user that round-ups is active for another goal already */}
        <NotificationModal
          variant="confirmations"
          message={t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.message")}
          title={t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.title")}
          isVisible={isSwitchRoundupsModalVisible}
          buttons={{
            primary: (
              <Button onPress={handleOnSwitchRoundUpButton}>
                {t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.switchRoundUpButton")}
              </Button>
            ),
            secondary: (
              <Button onPress={() => setIsSwitchRoundupsModalVisible(current => !current)}>
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
    </SafeAreaProvider>
  );
}

const deviceWidth = Dimensions.get("window").width;
const svgWidth = 390;
const svgHeight = 495;
const scaleFactor = deviceWidth / svgWidth;
const scaledHeight = svgHeight * scaleFactor;

const styles = StyleSheet.create({
  background: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  button: {
    flex: 1,
  },
  currency: {
    marginLeft: 4,
  },
  header: {
    height: scaledHeight,
  },
});

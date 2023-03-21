import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LightningBoltIcon, PlusIcon, QuestionIcon, RecurringEventIcon, WithdrawIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import { TableListCard, TableListCardGroup } from "@/components/TableList";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ProgressWheel from "../../components/ProgressWheel";
import { useRoundupFlag, useSavingsPot, useUpdateSavingsGoal } from "../../query-hooks";
import HeaderBackgroundSvg from "./header-background.svg";
import { calculateGoalBalanceOverThreeQuarters, getDayFromDate } from "./helpers";
import TransactionCardList from "./TransactionCardList";

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const { PotId, amountWithdrawn, redirectToFundingModal } = route.params;

  const fundGoalModalShown = useRef(false);
  const { data } = useSavingsPot(route.params.PotId);
  const { data: roundUpData } = useRoundupFlag();
  const updateSavingsGoalRoundUps = useUpdateSavingsGoal();

  const [isSwitchRoundupsModalVisible, setIsSwitchRoundupsModalVisible] = useState(false);
  const [showInfoRoundsUpsModal, setInfoRoundsUpModal] = useState(false);
  const [showGoalAlmostReachedNotification, setShowGoalAlmostReachedNotification] = useState(false);
  const [differenceNeededToReachGoal, setDifferenceNeededToReachGoal] = useState(0);
  const [showAmountWithdrawn, setShowAmountWithdrawn] = useState(amountWithdrawn);
  const [isRoundUpsOn, setIsRoundUpsOn] = useState(false);

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

      if (data) {
        setIsRoundUpsOn(data.RoundupFlag);
      }
    }, [redirectToFundingModal, amountWithdrawn, data, navigation, PotId])
  );

  const handleOnBackPress = () => {
    if (route.params.redirectToFundingModal) navigation.navigate("SavingsGoals.ListGoalsScreen");
    else navigation.goBack();
  };

  const handleOnOpenFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId,
      step: "one-off-payment",
    });
  };

  const handleOnAddRegularPaymentPress = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId,
      step: "regular-payments",
    });
  };

  const handleOnUpdatePaymentPress = () => {
    // TODO: implement redirect to edit / update regular payment when page will be available
    console.log("edit recurring payment");
  };

  const handleOnEdit = () => {
    navigation.navigate("SavingsGoals.EditGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnShowRoundupsInfoModal = () => {
    setInfoRoundsUpModal(!showInfoRoundsUpsModal);
  };

  const navigateToFAQ = () => {
    setInfoRoundsUpModal(false);
    navigation.navigate("FrequentlyAskedQuestions.LandingPage");
  };

  const handleOnOpenWithdraw = () => {
    if (data === undefined) return;

    const goalBalance = calculateGoalBalanceOverThreeQuarters(data);

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
    if (!data || !roundUpData) return;

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
    if (!data) return;

    const { GoalName, TargetAmount, TargetDate, NotificationFlag } = data;

    try {
      const response = await updateSavingsGoalRoundUps.mutateAsync({
        PotId,
        GoalName,
        TargetAmount,
        TargetDate,
        NotificationFlag,
        RoundupFlag: flagValue,
      });

      setIsRoundUpsOn(response.RoundupFlag);
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.navigate("SavingsGoals.ListGoalsScreen"),
        },
      ]);
    }
  };

  const handleOnSwitchRoundUpButton = async () => {
    await updateRoundUpFlag(true);
    setIsRoundUpsOn(true);
    setIsSwitchRoundupsModalVisible(false);
  };

  const iconAndLinkContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    color: theme.palette.primaryBase,
  }));

  const questionMarkIconColor = useThemeStyles(theme => theme.palette.primaryBase);

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
    <Page backgroundColor="neutralBase-60" insets={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.background}>
        <HeaderBackgroundSvg />
      </View>
      <SafeAreaView style={styles.header}>
        <NavHeader
          onBackPress={handleOnBackPress}
          title={data?.GoalName}
          color="white"
          end={<NavHeader.EditEndButton onPress={handleOnEdit} />}
        />
        <View style={headerContentStyle}>
          <ProgressWheel
            circleSize={128}
            current={Number(data?.AvailableBalanceAmount ?? 0)}
            total={Number(data?.TargetAmount ?? 0)}
            textColor="neutralBase-60"
            textSize="title2"
            bigCheckIcon={true}
          />
          <View style={goalAmountStyle}>
            <Typography.Header size="large" weight="medium" color="neutralBase-60">
              {formatter.format(Number(data?.AvailableBalanceAmount ?? 0))}
            </Typography.Header>
            <Typography.Text color="primaryBase-40" size="callout" weight="medium" style={styles.currency}>
              {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.currency")}
            </Typography.Text>
          </View>
          <Stack align="center" direction="vertical" gap="24p" style={headerProgressInfoStyle}>
            <Typography.Text size="callout" weight="medium" color="neutralBase-50" align="center">
              {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetAmountDetails", {
                TargetAmount: formatter.format(Number(data?.TargetAmount ?? 0)),
              })}
            </Typography.Text>
            <Typography.Text size="footnote" weight="medium" color="neutralBase-10" align="center">
              {data?.TargetDate !== undefined
                ? t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetDate", {
                    TargetDate: format(new Date(data?.TargetDate), "MMM d, yyyy"),
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
              {data?.RecurringPayments !== undefined ? (
                <TableListCard
                  onPress={handleOnUpdatePaymentPress}
                  label={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleExistingRegular")}
                  icon={<RecurringEventIcon />}
                  end={<TableListCard.Chevron />}
                  helperText={t("SavingsGoals.GoalDetailsScreen.RegularPayment.text", {
                    amount: data.RecurringPayments.PaymentAmount,
                    currency: data.RecurringPayments.Currency,
                    day: t("SavingsGoals.GoalDetailsScreen.RegularPayment.day", {
                      count: getDayFromDate(data.RecurringPayments.NextPaymentDate),
                      ordinal: true,
                    }),
                  })}
                />
              ) : (
                <TableListCard
                  onPress={handleOnAddRegularPaymentPress}
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
      <Modal onClose={() => setInfoRoundsUpModal(current => !current)} visible={showInfoRoundsUpsModal}>
        <Stack direction="vertical" gap="8p" style={styles.infoModalContentContainer}>
          <Typography.Text size="title2" weight="bold">
            {t("SavingsGoals.GoalDetailsScreen.InfoModal.title")}
          </Typography.Text>
          <Typography.Text size="callout">{t("SavingsGoals.GoalDetailsScreen.InfoModal.text")}</Typography.Text>
          <Pressable onPress={navigateToFAQ}>
            <Stack direction="horizontal" gap="5p" justify="center" align="center" style={iconAndLinkContainerStyle}>
              <QuestionIcon color={questionMarkIconColor} />
              <Typography.Text size="footnote" color="primaryBase">
                {t("SavingsGoals.GoalDetailsScreen.InfoModal.link")}
              </Typography.Text>
            </Stack>
          </Pressable>
        </Stack>
      </Modal>
    </Page>
  );
}

const BACKGROUND_HEIGHT = 495;
const formatter = Intl.NumberFormat("en-US");

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
    height: BACKGROUND_HEIGHT,
  },
  infoModalContentContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
});

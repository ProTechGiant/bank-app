import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { LightningBoltIcon, QuestionIcon, RecurringEventIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useSavingsPot } from "../../query-hooks";
import ActionButtons from "./ActionButtons";
import CardButtonToggle from "./CardButtonToggle";
import GoalDetailsHeader from "./GoalDetailsHeader";
import { calculateGoalBalanceOverThreeQuarters, getDayFromDate } from "./helpers";
import RegularPaymentCardButton from "./RegularPaymentCardButton";
import TransactionCardList from "./TransactionCardList";

export default function GoalDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const { PotId, amountWithdrawn, redirectToFundingModal } = route.params;
  const fundGoalModalShown = useRef(false);
  const [showRoundUpModal, setShowRoundUpModal] = useState(false);
  const [showInfoRoundsUpsModal, setInfoRoundsUpModal] = useState(false);
  const [showGoalAlmostReachedNotification, setShowGoalAlmostReachedNotification] = useState(false);
  const [differenceNeededToReachGoal, setDifferenceNeededToReachGoal] = useState(0);
  const [showAmountWithdrawn, setShowAmountWithdrawn] = useState(amountWithdrawn);
  const { data } = useSavingsPot(route.params.PotId);

  // TODO remove this and replace the condition with condition checking if RecurringPayments key exists in savings pot data object
  const toggleRegularPayment = true;

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
    }, [redirectToFundingModal, amountWithdrawn, navigation, PotId])
  );

  const handleOnBackPress = () => {
    if (route.params.redirectToFundingModal) navigation.navigate("SavingsGoals.ListGoalsScreen");
    else navigation.goBack();
  };

  const handleOnOpenFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId: PotId,
      step: "one-time-payment",
    });
  };

  const redirectToRegularPaymentFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      PotId: PotId,
      step: "recurring-deposit",
    });
  };

  const redirectToUpdateRegularPayment = () => {
    // TODO: implement redirect to edit / update regular payment when page will be available
    console.log("edit recurring payment");
  };

  const toggleRoundUp = () => {
    setShowRoundUpModal(!showRoundUpModal);

    handleRoundUp();
  };

  const handleRoundUp = () => {
    // TODO implement BE when ready

    console.log("round up logic");
  };

  const handleOnEdit = () => {
    navigation.navigate("SavingsGoals.EditGoalModal", {
      PotId: PotId,
    });
  };

  const showInfoModal = () => {
    setInfoRoundsUpModal(!showInfoRoundsUpsModal);
  };

  const navigateToFAQ = () => {
    setInfoRoundsUpModal(false);
    navigation.navigate("FrequentlyAskedQuestions.LandingPage");
  };

  const handleOnOpenWithdraw = () => {
    if (data === undefined) return;

    setShowGoalAlmostReachedNotification(false);
    const goalBalance = calculateGoalBalanceOverThreeQuarters(data);

    setDifferenceNeededToReachGoal(goalBalance.difference);

    if (goalBalance.overThreeQuarters) {
      setShowGoalAlmostReachedNotification(true);
    } else {
      navigation.navigate("SavingsGoals.WithdrawGoalModal", {
        PotId: PotId,
      });
    }
  };

  const handleWithdrawAnyway = () => {
    setShowGoalAlmostReachedNotification(false);

    navigation.navigate("SavingsGoals.WithdrawGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnEditGoal = () => {
    navigation.navigate("SavingsGoals.EditGoalModal", {
      PotId: PotId,
    });
  };

  const handleOnCloseWithdrawConfirmationModal = () => {
    navigation.navigate("SavingsGoals.GoalDetailsScreen", {
      PotId: PotId,
    });
  };

  const handleOnSeeAllTransactions = () => {
    // TODO: navigate to "All Transactions" page or open new modal showing them, TBD
    console.log("All transactions");
  };

  const navigationWrapper = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
    backgroundColor: theme.palette.primaryBase,
    justifyContent: "center",
  }));

  const contentContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    paddingTop: theme.spacing["16p"],
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  const iconAndLinkContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    color: theme.palette.primaryBase,
  }));

  const {
    height: iconHeight,
    width: iconWidth,
    color,
  } = useThemeStyles(theme => ({
    ...theme.iconDimensions.infoQuestionMark,
    color: theme.palette.primaryBase,
  }));

  const transactionsAndPaymentsContainer = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const sectionTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Page insets={["left", "right"]}>
      <ScrollView>
        <View style={navigationWrapper}>
          <NavHeader
            onBackPress={handleOnBackPress}
            title={data?.GoalName}
            color="white"
            end={<NavHeader.EditEndButton onPress={handleOnEdit} />}
          />
        </View>
        <View style={contentContainer}>
          {data && (
            <GoalDetailsHeader
              AvailableBalanceAmount={data.AvailableBalanceAmount}
              TargetAmount={data.TargetAmount}
              TargetDate={data.TargetDate}
            />
          )}
          <ActionButtons onFundingPress={handleOnOpenFunding} onWithdrawPress={handleOnOpenWithdraw} />
        </View>

        <View style={transactionsAndPaymentsContainer}>
          <View>
            <View style={sectionTitleStyle}>
              <Typography.Text size="callout" weight="medium">
                {t("SavingsGoals.GoalDetailsScreen.Payments.title")}
              </Typography.Text>
            </View>
            <View>
              {data && (
                <CardButtonToggle
                  onPress={toggleRoundUp}
                  onInfoPress={showInfoModal}
                  icon={<LightningBoltIcon />}
                  text={t("SavingsGoals.GoalDetailsScreen.RoundUp")}
                  toggleValue={data.RoundupFlag}
                />
              )}
              <Divider color="neutralBase-30" />

              {/* recurring (regular) payment data comes hardcoded from BE, the logic might change */}
              {/* toggleRegularPayment is for  testing purpose, when real data will come from BE, this will be removed or adapted*/}
              {toggleRegularPayment ? (
                <RegularPaymentCardButton
                  onPress={redirectToRegularPaymentFunding}
                  icon={<RecurringEventIcon />}
                  text={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleAddRegular")}
                />
              ) : (
                data && (
                  <RegularPaymentCardButton
                    onPress={redirectToUpdateRegularPayment}
                    text={t("SavingsGoals.GoalDetailsScreen.RegularPayment.titleExistingRegular")}
                    icon={<RecurringEventIcon />}
                    subtext={t("SavingsGoals.GoalDetailsScreen.RegularPayment.text", {
                      amount: data.RecurringPayments.PaymentAmount,
                      currency: data.RecurringPayments.Currency,
                      day: t("SavingsGoals.GoalDetailsScreen.RegularPayment.day", {
                        count: getDayFromDate(data.RecurringPayments.NextPaymentDate),
                        ordinal: true,
                      }),
                    })}
                  />
                )
              )}
            </View>
          </View>
          <View>
            <View style={sectionTitleStyle}>
              <Typography.Text size="callout" weight="medium">
                {t("SavingsGoals.GoalDetailsScreen.Transactions.title")}
              </Typography.Text>
              {/* //TO DO: transform this into a link to all transactions */}
              <Pressable onPress={handleOnSeeAllTransactions}>
                <Typography.Text size="callout" weight="medium" color="primaryBase">
                  {t("SavingsGoals.GoalDetailsScreen.Transactions.seeAll")}
                </Typography.Text>
              </Pressable>
            </View>

            <TransactionCardList />
          </View>
        </View>
      </ScrollView>
      {/* modal informing the user that the withdrawal was successful */}
      <NotificationModal
        variant="success"
        onClose={handleOnCloseWithdrawConfirmationModal}
        message={t("SavingsGoals.WithdrawModal.successfulWithdrawal.text")}
        title={t("SavingsGoals.WithdrawModal.successfulWithdrawal.title", {
          amount: showAmountWithdrawn,
        })}
        isVisible={amountWithdrawn ? true : false}
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
              <Button
                onPress={() => {
                  setShowGoalAlmostReachedNotification(!showGoalAlmostReachedNotification);
                }}>
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
        isVisible={showRoundUpModal}
        buttons={{
          primary: (
            <Button onPress={handleRoundUp}>
              {t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.switchRoundUpButton")}
            </Button>
          ),
          secondary: (
            <Button
              onPress={() => {
                setShowRoundUpModal(!showRoundUpModal);
              }}>
              {t("SavingsGoals.GoalDetailsScreen.RoundUpAlreadyActiveModal.cancelButton")}
            </Button>
          ),
        }}
      />
      {/* modal with information about rounds up */}
      <Modal
        onClose={() => {
          setInfoRoundsUpModal(!showInfoRoundsUpsModal);
        }}
        visible={showInfoRoundsUpsModal}>
        <Stack direction="vertical" gap="8p" style={styles.infoModalContentContainer}>
          <Typography.Text size="title2" weight="bold">
            {t("SavingsGoals.GoalDetailsScreen.InfoModal.title")}
          </Typography.Text>
          <Typography.Text size="callout">{t("SavingsGoals.GoalDetailsScreen.InfoModal.text")}</Typography.Text>
          <Pressable onPress={navigateToFAQ}>
            <Stack direction="horizontal" gap="5p" justify="center" align="center" style={iconAndLinkContainerStyle}>
              <QuestionIcon height={iconHeight} width={iconWidth} color={color} />
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

const styles = StyleSheet.create({
  infoModalContentContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
});

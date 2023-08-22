import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Alert } from "react-native";

import { useAuthContext } from "@/contexts/AuthContext";
import { warn } from "@/logger";
import deepLinkService from "@/services/deepLink/deepLinkService";
import notifications from "@/utils/push-notifications";

import useSavingsGoalNumber from "../features/Temporary/use-savings-goal-number";

const useNotificationHandler = () => {
  const navigation = useNavigation();
  const auth = useAuthContext();

  const handleOnClickNotification = async (url: string | undefined) => {
    try {
      if (!url) return;
      deepLinkService.handleDeepLink(url);
    } catch (err) {
      warn("Deep link error: ", JSON.stringify(err));
    }
  };

  const getSavingsGoalNumAsync = useSavingsGoalNumber();

  useEffect(() => {
    async function checkNotifications() {
      try {
        const notification = await notifications.onReceiveNotification();
        if (notification?.data?.type === "statement-status") {
          Alert.alert("", "Your statement request is ready!", [
            {
              text: "OK",
              onPress: () => handleOnClickNotification(notification.data?.url),
            },
            {
              text: "Cancel",
            },
          ]);
        }

        const response = await getSavingsGoalNumAsync.mutateAsync();

        if (notification?.data?.type === "saving-goal") {
          Alert.alert("Saving Goals", "", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("SavingsGoals.SavingsGoalsStack", {
                  savingsPotsNumber: response.SavingsPotsNumber,
                  screen: "SavingsGoals.GoalDetailsScreen",
                  params: {
                    PotId: "438aae6a-5987-4d52-9559-4e72dae70463",
                  },
                });
              },
            },
            {
              text: "Cancel",
            },
          ]);
        } else if (notification?.data?.type === "edit-goal" && !auth.isUserLocked) {
          Alert.alert("Edit Goal", "", [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("SavingsGoals.SavingsGoalsStack", {
                  savingsPotsNumber: response.SavingsPotsNumber,
                  screen: "SavingsGoals.EditGoalModal",
                  params: {
                    PotId: "438aae6a-5987-4d52-9559-4e72dae70463",
                  },
                }),
            },
            {
              text: "Cancel",
            },
          ]);
        } else if (notification?.data?.type === "withdraw-goal") {
          Alert.alert("WithDraw Goal", "", [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("SavingsGoals.SavingsGoalsStack", {
                  savingsPotsNumber: response.SavingsPotsNumber,
                  screen: "SavingsGoals.WithdrawGoalModal",
                  params: {
                    PotId: "438aae6a-5987-4d52-9559-4e72dae70463",
                    withdrawAmount: 80,
                  },
                }),
            },
            {
              text: "Cancel",
            },
          ]);
        } else if (notification?.data?.type === "fund-goal") {
          Alert.alert("Fund Goal", "", [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("SavingsGoals.SavingsGoalsStack", {
                  savingsPotsNumber: response.SavingsPotsNumber,
                  screen: "SavingsGoals.FundGoalModal",
                  params: {
                    PotId: "438aae6a-5987-4d52-9559-4e72dae70463",
                  },
                }),
            },
            {
              text: "Cancel",
            },
          ]);
        }
      } catch (error) {
        console.log("err ", JSON.stringify(error));
      }
    }

    checkNotifications();
  }, []);

  return null;
};

export default useNotificationHandler;

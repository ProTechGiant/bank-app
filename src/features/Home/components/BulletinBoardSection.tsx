import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, ProgressIndicator, RefreshSection, Stack, Typography } from "@/components";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useBulletinBoardTasks, useDismissBulletinBoardTask } from "../hooks/query-hooks";
import { ScreenRouteNameMappingType } from "../types";
import BulletinBoardSectionIcon from "./BulletinBoardSectionIcon";
import BulletinBoardTaskItem from "./BulletinBoardTaskItem";

const screenRouteNameMapping: ScreenRouteNameMappingType = {
  "redirectdestinationlink/lifestylepreference": "Settings.SettingsStack/Settings.LifeStyleScreen",
  "redirectdestinationlink/accounttopup": "AddMoney.AddMoneyStack/AddMoney.AddMoneyInfoScreen",
  "redirectdestinationlink/cardelevatelife": "CardActions.CardActionsStack/CardActions.HomeScreen",
};

export default function BulletinBoardSection() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    data: bulletinBoardTasks = { PendingTasks: [], total: 0, Completed: 0 },
    isError,
    isRefetchError,
    refetch,
  } = useBulletinBoardTasks();

  const { mutateAsync: dismissBulletinBoardTask, isLoading } = useDismissBulletinBoardTask();

  const [isTasksModalVisible, setIsTasksModalVisible] = useState(false);

  const handleOnViewTasksPress = () => {
    setIsTasksModalVisible(true);
  };

  const handleOnModalClosePress = () => {
    if (!isLoading) {
      setIsTasksModalVisible(false);
    }
  };

  const handleOnTaskActionPress = (targetScreen: string) => {
    return () => {
      const targetScreenMappedValue = screenRouteNameMapping[targetScreen];
      if (targetScreenMappedValue) {
        const [stack, screen] = targetScreenMappedValue.split("/");
        navigation.navigate(stack, { screen });
        setIsTasksModalVisible(false);
      } else {
        warn(`Mapping not found for targetScreen:`, targetScreen);
      }
    };
  };

  const handleOnTaskDismissPress = (ActionTypeId: string) => {
    return async () => {
      try {
        await dismissBulletinBoardTask(ActionTypeId);
      } catch (error) {
        warn(`Error dismissing Bulletin Board Task:`, JSON.stringify(error));
      }
    };
  };

  const sectionContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["48p"],
  }));

  const scrollViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    maxHeight: "100%",
  }));

  if (isError || isRefetchError) {
    return (
      <RefreshSection hint={t("Home.DashboardScreen.bulletinBoardSection.loadTasksError")} onRefreshPress={refetch} />
    );
  }

  if (!bulletinBoardTasks.PendingTasks || bulletinBoardTasks.PendingTasks.length === 0) {
    return null;
  }

  return (
    <Stack direction="vertical" align="stretch">
      <Stack direction="horizontal" align="center" gap="8p" style={sectionContainer}>
        <BulletinBoardSectionIcon />
        <Stack direction="vertical" align="stretch" gap="8p" flex={1}>
          <ProgressIndicator
            currentStep={Number(bulletinBoardTasks.Completed)}
            totalStep={Number(bulletinBoardTasks.total)}
          />
          <Stack direction="horizontal" align="center" justify="space-between">
            <Typography.Text size="caption2" color="neutralBase+10">
              {t("Home.DashboardScreen.bulletinBoardSection.tasksStatus", {
                total: bulletinBoardTasks.total,
                completed: bulletinBoardTasks.Completed,
              })}
            </Typography.Text>
            <Pressable onPress={handleOnViewTasksPress}>
              <Typography.Text size="caption2" color="primaryBase-40">
                {t("Home.DashboardScreen.bulletinBoardSection.viewTasks")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
      <Modal
        visible={isTasksModalVisible}
        onClose={handleOnModalClosePress}
        headerText={t("Home.DashboardScreen.bulletinBoardSection.pendingTasks")}
        style={styles.modalContainerStyle}>
        <ScrollView contentContainerStyle={contentContainerStyle} style={scrollViewContainerStyle}>
          {bulletinBoardTasks.PendingTasks.map((item, index) => {
            return (
              <BulletinBoardTaskItem
                item={item}
                index={index}
                key={item.ActionId}
                showBottomDivider={index < bulletinBoardTasks.PendingTasks.length - 1}
                onTaskActionPress={handleOnTaskActionPress}
                onTaskDismissPress={handleOnTaskDismissPress}
              />
            );
          })}
        </ScrollView>
      </Modal>
    </Stack>
  );
}

const styles = StyleSheet.create({
  modalContainerStyle: {
    maxHeight: "90%",
  },
});

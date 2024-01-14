import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, ProgressIndicator, RefreshSection, Stack, Typography } from "@/components";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useHomepageContent } from "../contexts/HomepageContentContext";
import { useDismissBulletinBoardTask } from "../hooks/query-hooks";
import { DEFAULT_BULLETIN_BOARD, ScreenRouteNameMappingType } from "../types";
import BulletinBoardSectionIcon from "./BulletinBoardSectionIcon";
import BulletinBoardTaskItem from "./BulletinBoardTaskItem";

interface BulletInBoardProps {
  testID?: string;
  isError: boolean;
}

const screenRouteNameMapping: ScreenRouteNameMappingType = {
  "redirectdestinationlink/lifestylepreference": "Settings.SettingsStack/Settings.LifeStyleScreen",
  "redirectdestinationlink/accounttopup": "AddMoney.AddMoneyStack/AddMoney.AddMoneyInfoScreen",
  "redirectdestinationlink/cardelevatelife": "CardActions.CardActionsStack/CardActions.HomeScreen",
};

export default function BulletinBoardSection({ testID, isError }: BulletInBoardProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { bulletinBoardTasks, refetchBulletinBoardTasks } = useHomepageContent();
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
    marginVertical: theme.spacing["24p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["48p"],
  }));

  const scrollViewContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: -theme.spacing["20p"],
    maxHeight: "100%",
  }));
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  if (bulletinBoardTasks === DEFAULT_BULLETIN_BOARD) {
    return isError ? (
      <RefreshSection
        hint={t("Home.DashboardScreen.bulletinBoardSection.loadTasksError")}
        onRefreshPress={refetchBulletinBoardTasks}
      />
    ) : null;
  }

  if (!bulletinBoardTasks.PendingTasks || bulletinBoardTasks.PendingTasks.length === 0) {
    return null;
  }

  return (
    <Stack testID={testID} direction="vertical" align="stretch" style={contentStyle}>
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
            <Pressable
              onPress={handleOnViewTasksPress}
              testID={testID !== undefined ? `${testID}-ViewTasksButton` : undefined}>
              <Typography.Text size="caption2" color="neutralBase">
                {t("Home.DashboardScreen.bulletinBoardSection.viewTasks")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </Stack>
      </Stack>
      <Modal
        testID={testID !== undefined ? `${testID}:ViewTaskModal` : undefined}
        visible={isTasksModalVisible}
        onClose={handleOnModalClosePress}
        headerText={t("Home.DashboardScreen.bulletinBoardSection.pendingTasks")}
        style={styles.modalContainerStyle}>
        <ScrollView contentContainerStyle={contentContainerStyle} style={scrollViewContainerStyle}>
          {bulletinBoardTasks.PendingTasks.map((item, index) => {
            return (
              <BulletinBoardTaskItem
                testID={testID !== undefined ? `${testID}:BulletBoardTaskItem` : undefined}
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

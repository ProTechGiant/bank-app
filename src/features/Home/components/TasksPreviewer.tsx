import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { AngleDownIcon, AngleUpIcon, ClockIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TaskType } from "../types";
import PillButton from "./PillButton";

interface TasksPreviewerProps {
  tasks: TaskType[];
}

export default function TasksPreviewer({ tasks }: TasksPreviewerProps) {
  const { t } = useTranslation();

  const [taskExpandedNumber, setTaskExpanedNumber] = useState<number>(0);
  const [isTaskExpanded, setIsTaskExpanded] = useState<boolean>(false);

  const handleOnToggle = () => {
    setIsTaskExpanded(!isTaskExpanded);
    setTaskExpanedNumber(0);
  };

  const handleonTaskButtonPress = () => {
    // navigation depend on  real screen name , it will change it later when BE team  insert real data
    // navigation.navigate(screen);
  };

  const handleOnDismissPress = () => {
    // will integrate with api  later
  };

  const titleContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    padding: theme.spacing["16p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
  }));

  const itemContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["supportBase-20"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
  }));

  const titleTaskContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const actionsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["8p"],
  }));

  const dismissContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingEnd: theme.spacing["20p"],
  }));

  return (
    <View style={containerStyle}>
      <Pressable onPress={handleOnToggle} style={titleContainerStyles}>
        <Stack align="center" direction="horizontal" gap="8p" style={styles.titleContainer}>
          <ClockIcon color={iconColor} />
          <Typography.Text color="primaryBase" size="callout" weight="semiBold" style={styles.titleText}>
            {tasks.length > 1
              ? t("Home.DashboardScreen.tasks", { count: tasks.length })
              : t("Home.DashboardScreen.task", { count: tasks.length })}
            {t("Home.DashboardScreen.leftToComplete")}
          </Typography.Text>
          {isTaskExpanded ? <AngleUpIcon color={iconColor} /> : <AngleDownIcon color={iconColor} />}
        </Stack>
      </Pressable>
      {isTaskExpanded ? (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          {tasks?.map((task, index) => {
            return (
              <Pressable key={index} onPress={() => setTaskExpanedNumber(index + 1)}>
                <View style={itemContainerStyle}>
                  <View style={titleTaskContainerStyle}>
                    <Typography.Text color="primaryBase-20" size="footnote" weight="bold" style={styles.titleText}>
                      {task.MessageText}
                    </Typography.Text>
                  </View>
                  {taskExpandedNumber === index + 1 && (
                    <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
                      <View style={styles.descriptionContainer}>
                        <Typography.Text color="primaryBase" size="caption2" weight="regular" style={styles.titleText}>
                          {task.Description}
                        </Typography.Text>
                      </View>
                      <Stack
                        direction="horizontal"
                        justify="space-between"
                        align="center"
                        style={actionsContainerStyle}>
                        <View style={dismissContainerStyle}>
                          <Pressable onPress={handleOnDismissPress}>
                            <Typography.Text
                              color="neutralBase+30"
                              size="footnote"
                              weight="medium"
                              style={styles.titleText}>
                              {t("Home.DashboardScreen.dismiss")}
                            </Typography.Text>
                          </Pressable>
                        </View>
                        <View style={styles.rightActionContainer}>
                          <PillButton onPress={handleonTaskButtonPress} backgroundColor="primaryBase">
                            {task.ButtonName}
                          </PillButton>
                        </View>
                      </Stack>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    flexShrink: 1,
    marginEnd: 4,
  },
  rightActionContainer: {
    flexShrink: 1,
  },
  titleContainer: {
    width: "100%",
  },
  titleText: {
    flexGrow: 1,
  },
});

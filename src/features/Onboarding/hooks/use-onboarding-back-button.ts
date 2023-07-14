import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { BackHandler } from "react-native";

import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { useOnboardingContext } from "../contexts/OnboardingContext";

export const useOnboardingBackButton = () => {
  const navigation = useNavigation();

  const { revertWorkflowTask, fetchLatestWorkflowTask, setIsLoading } = useOnboardingContext();
  const isBackbuttonEnabled = useRef(true);

  useFocusEffect(
    useCallback(() => {
      const handleOnBackButtonClick = () => {
        handleOnBackPress();

        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleOnBackButtonClick);

      return () => BackHandler.removeEventListener("hardwareBackPress", handleOnBackButtonClick);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const handleOnBackPress = async () => {
    if (!isBackbuttonEnabled.current) {
      return;
    }

    isBackbuttonEnabled.current = false;

    try {
      setIsLoading(true);
      const workflowTask = await fetchLatestWorkflowTask();

      if (workflowTask && workflowTask?.Name !== undefined) {
        await revertWorkflowTask(workflowTask);
      }

      navigation.goBack();
    } catch (err) {
      warn("onboarding", "Could not revert to previous task. Error: ", JSON.stringify(err));
    } finally {
      isBackbuttonEnabled.current = true;
      setIsLoading(false);
    }
  };

  return handleOnBackPress;
};

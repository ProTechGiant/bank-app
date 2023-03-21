import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { useOnboardingContext } from "../contexts/OnboardingContext";

export const useOnboardingBackButton = () => {
  const navigation = useNavigation();
  const { revertWorkflowTask, fetchLatestWorkflowTask } = useOnboardingContext();

  const handleOnBackPress = async () => {
    try {
      const workflowTask = await fetchLatestWorkflowTask();
      if (workflowTask && workflowTask?.Name !== undefined) {
        await revertWorkflowTask(workflowTask);
      }
      navigation.goBack();
    } catch (err) {
      warn("tasks", "Could not get Task. Error: ", JSON.stringify(err));
    }
  };

  return handleOnBackPress;
};

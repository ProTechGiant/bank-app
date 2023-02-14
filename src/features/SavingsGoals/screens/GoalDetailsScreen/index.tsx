import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useRef } from "react";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/MainStackParams";
import useNavigation from "@/navigation/use-navigation";

export default function GoalDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "SavingsGoals.GoalDetailsScreen">>();
  const fundGoalModalShown = useRef(false);

  // Immediately funding goal modal if needed
  useFocusEffect(
    useCallback(() => {
      if (true === route.params.redirectToFundingModal && !fundGoalModalShown.current) {
        navigation.navigate("SavingsGoals.FundGoalModal", {
          SavingsPotId: route.params.SavingsPotId,
          isFirstFunding: true,
        });

        // or else it'll be shown every time
        fundGoalModalShown.current = true;
      }
    }, [route.params])
  );

  const handleOnBackPress = () => {
    if (route.params.redirectToFundingModal) navigation.navigate("SavingsGoals.ListGoalsScreen");
    else navigation.goBack();
  };

  const handleOnOpenFunding = () => {
    navigation.navigate("SavingsGoals.FundGoalModal", {
      SavingsPotId: route.params.SavingsPotId,
    });
  };

  return (
    <Page>
      <NavHeader onBackPress={handleOnBackPress} title="Goal details screen" />
      <ContentContainer>
        <Button onPress={handleOnOpenFunding}>Open funding modal</Button>
      </ContentContainer>
    </Page>
  );
}

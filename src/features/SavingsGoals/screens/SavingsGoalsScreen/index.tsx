import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

export default function SavingsGoalsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnSetGoal = () => {
    navigation.navigate("SavingsGoals.CreateGoalModal");
  };

  return (
    <Page>
      <NavHeader title={t("SavingsGoals.SavingsGoalsScreen.navTitle")} />
      <ContentContainer>
        <Button onPress={handleOnSetGoal}>Set Goal</Button>
      </ContentContainer>
    </Page>
  );
}

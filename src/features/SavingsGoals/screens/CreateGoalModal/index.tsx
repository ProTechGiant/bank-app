import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";

export default function SavingsGoalsModal() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnClosePress = () => {
    navigation.navigate("SavingsGoals.SavingsGoalsScreen");
  };

  return (
    <Page>
      <NavHeader
        title={t("SavingsGoals.CreateGoalModal.navTitle")}
        withBackButton={false}
        right={<NavHeader.CloseEndButton onPress={handleOnClosePress} />}
      />
      <ContentContainer>
        <Button>{t("SavingsGoals.CreateGoalModal.button")}</Button>
      </ContentContainer>
    </Page>
  );
}

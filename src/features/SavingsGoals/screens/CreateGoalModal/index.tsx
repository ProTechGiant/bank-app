import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    <SafeAreaProvider>
      <Page>
        <NavHeader
          title={t("SavingsGoals.CreateGoalModal.navTitle")}
          withBackButton={false}
          end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />}
        />
        <ContentContainer>
          <Button>{t("SavingsGoals.CreateGoalModal.button")}</Button>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

import { useTranslation } from "react-i18next";
import { View } from "react-native";

import Button from "@/components/Button";
import useNavigation from "@/navigation/use-navigation";

function SingleUserCardsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const navigateToGenerateCard = () => {
    navigation.navigate("SingleUseCards.SingleUseCardInfo");
  };

  return (
    <View style={{ alignContent: "center", marginTop: "50%", padding: "10%" }}>
      <Button variant="primary" color="light" onPress={navigateToGenerateCard}>
        {t("SingleUseCard.InfoScreen.generateBtn")}
      </Button>
    </View>
  );
}

export default SingleUserCardsScreen;

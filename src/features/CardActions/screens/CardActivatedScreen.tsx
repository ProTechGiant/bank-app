import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

import CardActivatedSuccessIcon from "./../assets/card-activated-success.svg";

export default function CardActivatedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.CardActivatedScreen">>();
  const title =
    route.params.title !== undefined ? route.params.title : t("CardActions.ActivationScreen.successMessage");
  const message =
    route.params.message !== undefined ? route.params.message : t("CardActions.ActivationScreen.successDescription");

  const handleOnFinish = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Home" });
  };

  return (
    <HeroSlider
      variant="default"
      buttonText=""
      data={[
        {
          topElement: <CardActivatedSuccessIcon />,
          title: title,
          text: message,
          darkTheme: true,
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      darkTheme
      testID="CardActions.CardActivatedScreen:HeroSlider">
      <Button
        variant="primary"
        color="dark"
        onPress={handleOnFinish}
        testID="CardActions.CardActivatedScreen:FinishButton">
        {t("CardActions.ActivationScreen.button")}
      </Button>
    </HeroSlider>
  );
}

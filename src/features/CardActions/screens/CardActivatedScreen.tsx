import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import useNavigation from "@/navigation/use-navigation";

import CardActivatedSuccessIcon from "./../assets/card-activated-success.svg";

export default function CardActivatedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.HomeScreen");
  };

  return (
    <HeroSlider
      variant="default"
      buttonText=""
      data={[
        {
          topElement: <CardActivatedSuccessIcon />,
          title: t("CardActions.ActivationScreen.successMessage"),
          text: t("CardActions.ActivationScreen.successDescription"),
          darkTheme: true,
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      darkTheme>
      <Button variant="primary" color="dark" onPress={handleOnFinish}>
        {t("CardActions.ActivationScreen.button")}
      </Button>
    </HeroSlider>
  );
}

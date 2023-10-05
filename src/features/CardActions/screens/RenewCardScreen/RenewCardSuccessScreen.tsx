import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { CardSuccessIcon } from "@/assets/icons";
import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";

export default function RenewCardSuccessScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<AuthenticatedStackParams, "CardActions.RenewCardSuccessScreen">>();
  const { t } = useTranslation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.CardDetailsScreen", {
      cardId: params.cardId,
    });
  };

  return (
    <HeroSlider
      variant="default"
      buttonText=""
      data={[
        {
          topElement: <CardSuccessIcon />,
          title: t("CardActions.ApplyCardScreen.CardRenewalScreen.renewSuccessTitle"),
          text: t("CardActions.ApplyCardScreen.CardRenewalScreen.renewSuccessMessage"),
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      darkTheme>
      <Button variant="primary" color="dark" onPress={handleOnFinish}>
        {t("CardActions.ReportCardScreen.ReportCardSuccessScreen.okButton")}
      </Button>
    </HeroSlider>
  );
}

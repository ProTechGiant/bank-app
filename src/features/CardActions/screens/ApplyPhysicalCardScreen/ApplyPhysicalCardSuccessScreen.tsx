import React from "react";
import { useTranslation } from "react-i18next";

import { ApplyCardSuccessIcon } from "@/assets/icons/";
import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import useNavigation from "@/navigation/use-navigation";

export default function ApplyPhysicalCardSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnFinish = () => {
    navigation.navigate("CardActions.HomeScreen");
  };
  return (
    <HeroSlider
      variant="default"
      buttonText=""
      darkTheme={true}
      data={[
        {
          topElement: <ApplyCardSuccessIcon />,
          title: t("CardActions.ReportCardScreen.ApplyPhysicalCardSuccessScreen.title"),
          text: t("CardActions.ReportCardScreen.ApplyPhysicalCardSuccessScreen.description"),
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      end={<NavHeader.CloseEndButton onPress={handleOnFinish} />}
      hasBackButton={false}
      testID="CardActions.ApplyPhysicalCardSuccessScreen:HeroSlider">
      <Button
        variant="primary"
        color="dark"
        onPress={handleOnFinish}
        testID="CardActions.ApplyPhysicalCardSuccessScreen:OkButton">
        {t("CardActions.ReportCardScreen.ApplyPhysicalCardSuccessScreen.okButton")}
      </Button>
    </HeroSlider>
  );
}

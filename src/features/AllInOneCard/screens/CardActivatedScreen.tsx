import { StackActions } from "@react-navigation/native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";

import { ActivatedCardIcon } from "../assets/icons";
import { useAllInOneCardContext } from "../contexts/AllInOneCardContext";

export default function CardActivatedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setAllInOneCardStatus } = useAuthContext();
  const { cardType } = useAllInOneCardContext();

  useEffect(() => {
    setAllInOneCardStatus("inActive");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnFinish = () => {
    const screenToPop = cardType === "neraPlus" ? 7 : 6;
    // Popping the stack based on user's card selection journey.
    // 1. Entry Point Screen
    // 2. Select Card Screen
    // 3. Redemption Screen
    // 4. Payment Option Screen (only for Nera Plus)
    // 5. Review Screen
    // 6. OTP Screens
    // 7. Activated Card Screen
    navigation.dispatch(StackActions.pop(screenToPop));
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const handleOnActivate = () => {
    navigation.navigate("AllInOneCard.CreatePINScreen");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnFinish} />} />
      <HeroSlider
        variant="default"
        buttonText=""
        data={[
          {
            topElement: <ActivatedCardIcon />,
            title: t("AllInOneCard.ActivatedCardScreen.title"),
            text: t("AllInOneCard.ActivatedCardScreen.description"),
            darkTheme: true,
          },
        ]}
        lastButtonText=""
        onFinishPress={handleOnFinish}
        hasBackButton={false}>
        <Button variant="primary" onPress={handleOnActivate} testID="CardActions.CardActivatedScreen:FinishButton">
          {t("AllInOneCard.ActivatedCardScreen.button")}
        </Button>
      </HeroSlider>
    </Page>
  );
}

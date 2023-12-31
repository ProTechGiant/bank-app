import { useTranslation } from "react-i18next";

import { CardSuccessIcon } from "@/assets/icons";
import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import useNavigation from "@/navigation/use-navigation";

export default function ChangeVerifiedScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnFinish = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Home" });
  };

  return (
    <HeroSlider
      variant="default"
      buttonText=""
      data={[
        {
          topElement: <CardSuccessIcon />,
          title: t("InternalTransfers.TransferPaymentScreen.changeVerifiedTitle"),
          text: t("InternalTransfers.TransferPaymentScreen.changeVerifiedMessage"),
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      hasBackButton={false}
      darkTheme
      testID="InternalTransfers.TransferPaymentScreen:HeroSlider">
      <Button
        variant="primary"
        color="dark"
        onPress={handleOnFinish}
        testID="InternalTransfers.TransferPaymentScreen:OkButton">
        {t("InternalTransfers.TransferPaymentScreen.okButton")}
      </Button>
    </HeroSlider>
  );
}

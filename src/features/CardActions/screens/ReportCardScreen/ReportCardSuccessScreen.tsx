import { useTranslation } from "react-i18next";
import { Platform, View, ViewStyle } from "react-native";

import { CardSuccessIcon } from "@/assets/icons";
import AddToAppleWalletButton from "@/components/AddToAppleWalletButton";
import Button from "@/components/Button";
import { HeroSlider } from "@/components/HeroSlider";
import NavHeader from "@/components/NavHeader";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { MadaPayBanner } from "../../components";
import useAppleWallet from "../../hooks/use-apple-wallet";

interface ReportCardSuccessScreenProps {
  cardId: string;
}

export default function ReportCardSuccessScreen({ cardId }: ReportCardSuccessScreenProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isAppleWalletAvailable, canAddCardToAppleWallet, addCardToAppleWallet } = useAppleWallet(cardId);

  const handleOnAddToWallet = async () => {
    try {
      const _response = await addCardToAppleWallet();
      navigation.navigate("CardActions.CardDetailsScreen", { cardId });
    } catch (error) {
      warn("card-actions", `Could not add card "${cardId}" to Apple Wallet: `, JSON.stringify(error));
    }
  };

  const handleOnFinish = () => {
    navigation.navigate("CardActions.HomeScreen");
  };

  const madaPayContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <HeroSlider
      variant="default"
      buttonText=""
      data={[
        {
          topElement: <CardSuccessIcon />,
          title: t("CardActions.ReportCardScreen.ReportCardSuccessScreen.title"),
          text: t("CardActions.ReportCardScreen.ReportCardSuccessScreen.description", {
            device: Platform.OS === "android" ? t("CardActions.madaPay") : t("CardActions.appleWallet"),
          }),
        },
      ]}
      lastButtonText=""
      onFinishPress={handleOnFinish}
      end={<NavHeader.CloseEndButton onPress={handleOnFinish} />}
      hasBackButton={false}
      darkTheme>
      {isAppleWalletAvailable && canAddCardToAppleWallet ? (
        <AddToAppleWalletButton onPress={handleOnAddToWallet} />
      ) : null}
      {Platform.OS === "android" ? (
        <View style={madaPayContainerStyle}>
          <MadaPayBanner />
        </View>
      ) : null}
      <Button
        variant={!isAppleWalletAvailable || !canAddCardToAppleWallet ? "primary" : "tertiary"}
        color={!isAppleWalletAvailable || !canAddCardToAppleWallet ? "dark" : "light"}
        onPress={handleOnFinish}>
        {t("CardActions.ReportCardScreen.ReportCardSuccessScreen.okButton")}
      </Button>
    </HeroSlider>
  );
}

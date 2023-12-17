import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AppleConnectIllustrationIcon } from "../../assets/icons";

export default function CardToWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnContinue = () => {
    navigation.navigate("AllInOneCard.WelcomeAddedToAppleWalletScreen");
  };

  const messageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Page testID="AllInOneCard.CardToWalletScreen:Page">
      <NavHeader withBackButton={true} testID="AllInOneCard.CardToWalletScreen:NavHeader" />
      <ContentContainer testID="AllInOneCard.CardToWalletScreen:ContentContainer">
        <Stack direction="vertical" justify="space-around" gap="4p" flex={1} align="center">
          <AppleConnectIllustrationIcon />
          <Stack direction="vertical" gap="8p" align="center" justify="center" style={messageContainerStyle}>
            <Typography.Text size="title1" weight="bold">
              {t("CardActions.CardToWalletScreen.title")}
            </Typography.Text>
            <Typography.Text align="center" size="callout" weight="regular" color="neutralBase+10">
              {t("CardActions.CardToWalletScreen.subtitle")}
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Button onPress={handleOnContinue} variant="primary" testID="AllInOneCard.CardToWalletScreen:ButtonContinue">
            {t("CardActions.CardToWalletScreen.continueButtonText")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

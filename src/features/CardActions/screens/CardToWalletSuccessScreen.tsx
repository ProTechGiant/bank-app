import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import AddCardToWalletSuccessImage from "../assets/icons/AddCardToWalletSuccessImage";

export default function CardToWalletSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.navigate("CardActions.HomeScreen");
  };

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    gap: theme.spacing["24p"],
    marginTop: -20,
    marginBottom: theme.spacing["8p"],
    width: "100%",
  }));

  const messageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="primaryBase">
      <NavHeader withBackButton={true} />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="center" gap="24p" align="stretch">
          <View style={headerViewStyle}>
            <AddCardToWalletSuccessImage />
            <Stack direction="vertical" gap="8p" align="center" justify="center" style={messageContainerStyle}>
              <Typography.Text size="brand" align="center" weight="bold" color="neutralBase-60">
                {t("CardActions.CardToWalletSuccessScreen.title")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase-60">
                {t("CardActions.CardToWalletSuccessScreen.subtitle")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>

        <Stack direction="vertical" gap="24p" align="stretch">
          <Button onPress={navigateBack} color="dark" variant="primary">
            {t("CardActions.CardToWalletSuccessScreen.okButtonText")}
          </Button>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

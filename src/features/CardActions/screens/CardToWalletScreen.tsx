import { RouteProp, useRoute } from "@react-navigation/native";
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

import AddCardToWalletImage from "../assets/icons/AddCardToWalletImage";
import { CardActionsStackParams } from "../CardActionsStack";

export default function CardToWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.CardToWalletScreen">>();
  const params = route.params;

  const handleOnContinue = () => {
    navigation.navigate("CardActions.WaitingVerificationCard", {
      cardId: params.cardId,
    });
  };
  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    rowGap: theme.spacing["4p"],
    marginTop: -20,
    marginBottom: theme.spacing["8p"],
    width: "100%",
  }));

  const messageContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["12p"],
  }));

  return (
    <Page>
      <NavHeader withBackButton={true} />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="flex-start" gap="4p" align="stretch">
          <View style={headerViewStyle}>
            <AddCardToWalletImage />
            <Stack direction="vertical" gap="8p" align="center" justify="center" style={messageContainerStyle}>
              <Typography.Text size="brand" weight="bold">
                {t("CardActions.CardToWalletScreen.title")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase+10">
                {t("CardActions.CardToWalletScreen.subtitle")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Stack direction="vertical" gap="4p" align="stretch">
            <Button onPress={handleOnContinue} variant="primary">
              {t("CardActions.CardToWalletScreen.continueButtonText")}
            </Button>
          </Stack>
        </Stack>
      </ContentContainer>
    </Page>
  );
}

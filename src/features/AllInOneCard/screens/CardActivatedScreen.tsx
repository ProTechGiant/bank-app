import { StackActions } from "@react-navigation/native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

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

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const handleOnActivate = () => {
    navigation.navigate("AllInOneCard.CreatePINScreen");
  };

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={handleOnFinish} />} />
      <ContentContainer>
        <View style={styles.container}>
          <Stack flex={1} direction="vertical" align="center">
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
              <ActivatedCardIcon />
            </View>
            <Stack direction="vertical" align="center" flex={0.7}>
              <Stack direction="vertical" align="center" gap="24p" justify="space-between" style={containerStyle}>
                <Typography.Header size="large" weight="bold" align="center" color="neutralBase+30">
                  {t("AllInOneCard.ActivatedCardScreen.title")}
                </Typography.Header>
                <Typography.Text size="callout" weight="regular" align="center" color="neutralBase+10">
                  {t("AllInOneCard.ActivatedCardScreen.description")}
                </Typography.Text>
              </Stack>
            </Stack>
          </Stack>
          <Button onPress={handleOnActivate}>{t("AllInOneCard.ActivatedCardScreen.button")}</Button>
        </View>
      </ContentContainer>
    </Page>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
});

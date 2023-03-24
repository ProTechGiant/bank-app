import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

import BottomTriangle from "../assets/background-bottom.svg";
import HeaderTriangle from "../assets/background-top-start.svg";

export default function ApplePayActivatedScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleOnFinished = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  return (
    <Page>
      <HeaderTriangle style={styles.headerTriangle} />
      <BottomTriangle style={styles.bottomTriangle} />
      <NavHeader withBackButton={false} end="close" />
      <ContentContainer>
        <Stack direction="vertical" justify="space-between" align="center">
          <View style={styles.iconContainer}>
            <TickCircleIcon />
          </View>
          <Typography.Text size="large" weight="bold" color="primaryBase-10">
            {t("ApplyCards.ApplePayActivatedScreen.title")}
          </Typography.Text>
        </Stack>
        <View style={styles.button}>
          <Button variant="primary" block onPress={handleOnFinished}>
            {t("ApplyCards.ApplePayActivatedScreen.button")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  bottomTriangle: {
    bottom: 0,
    position: "absolute",
  },
  button: {
    marginTop: "auto",
  },
  headerTriangle: {
    position: "absolute",
  },
  iconContainer: {
    paddingBottom: 35,
    paddingTop: 146,
  },
});

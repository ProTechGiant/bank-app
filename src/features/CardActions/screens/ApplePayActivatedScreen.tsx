import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { TickCircleIcon } from "@/assets/icons";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";

import BottomTriangle from "../assets/background-bottom.svg";
import HeaderTriangle from "../assets/background-top-start.svg";

export default function ApplePayActivatedScreen() {
  const { t } = useTranslation();
  const auth = useAuthContext();

  const handleOnFinished = () => {
    //TODO: Once the temporary screen is removed, the navigation will be adjusted to directly navigate to the home screen.
    // navigation.navigate("Home.HomeStack", {
    //   screen: "Home.DashboardScreen",
    // });
    auth.logout();
  };

  return (
    <Page>
      <HeaderTriangle style={styles.headerTriangle} />
      <BottomTriangle style={styles.bottomTriangle} />
      <NavHeader
        withBackButton={false}
        end={
          <NavHeader.CloseEndButton
            onPress={() => {
              auth.logout();
            }}
          />
        }
        testID="CardActions.ApplePayActivatedScreen:NavHeader"
      />
      <ContentContainer>
        <Stack direction="vertical" justify="space-between" align="center">
          <View style={styles.iconContainer}>
            <TickCircleIcon />
          </View>
          <Typography.Text size="large" weight="bold" color="primaryBase-10">
            {t("CardActions.ApplePayActivatedScreen.title")}
          </Typography.Text>
        </Stack>
        <View style={styles.button}>
          <Button
            variant="primary"
            block
            onPress={handleOnFinished}
            testID="CardActions.ApplePayActivatedScreen:FinishButton">
            {t("CardActions.ApplePayActivatedScreen.button")}
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

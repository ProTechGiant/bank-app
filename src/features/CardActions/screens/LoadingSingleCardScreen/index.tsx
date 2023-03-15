import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function LoadingSingleCardScreen() {
  const route = useRoute<RouteProp<MainStackParams, "CardActions.LoadingSingleCardScreen">>();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (undefined === response || response.Header.ErrorId !== "0") {
      setTimeout(() => setIsAlertVisible(true), 500);
      return;
    }

    const handleOnSuccess = () => {
      navigation.goBack();

      navigation.navigate("CardActions.CardDetailsScreen", {
        cardType: "single-use",
        action: "generate-single-use-card",
        cardId: response.Body.CardId,
      });
    };

    setTimeout(handleOnSuccess, 1000);
  }, [route, isAlertVisible]);

  const handleOnCloseNotification = () => {
    navigation.goBack();
  };

  const response = route.params?.cardCreateResponse;
  const loadingIndicatorColor = useThemeStyles(theme => theme.palette["neutralBase-50"]);

  return (
    <>
      <DarkOneGradient>
        <Page>
          <NavHeader withBackButton color="white" />
          <View style={styles.container}>
            <ActivityIndicator color={loadingIndicatorColor} size="small" />
          </View>
        </Page>
      </DarkOneGradient>
      <NotificationModal
        variant="error"
        onClose={handleOnCloseNotification}
        message={t("errors.generic.message")}
        title={t("errors.generic.title")}
        isVisible={isAlertVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

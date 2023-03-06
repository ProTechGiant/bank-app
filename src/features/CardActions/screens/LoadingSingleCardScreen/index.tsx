import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View, ViewStyle } from "react-native";

import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function LoadingSingleCardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const mainViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    flex: 1,
    justifyContent: "center",
  }));

  const loadingIndicatorColor = useThemeStyles(theme => theme.palette["neutralBase-50"], ["neutralBase-50"]);

  useEffect(() => {
    /* should call here the creation API */
    setTimeout(() => {
      // setShowNotificationAlert(true);
      navigation.navigate("CardActions.CardDetailsScreen", { cardType: "single-use", isCardCreated: true });
    }, 2000);
  }, []);

  const handleOnCloseNotification = () => {
    setShowNotificationAlert(false);
    navigation.goBack();
  };

  return (
    <DarkOneGradient>
      <Page>
        <NavHeader withBackButton color="white" />
        <View style={mainViewStyle}>
          <ActivityIndicator color={loadingIndicatorColor} size="small" />
        </View>
        <NotificationModal
          variant="error"
          onClose={handleOnCloseNotification}
          message={t("errors.generic.message")}
          title={t("errors.generic.title")}
          isVisible={showNotificationAlert}
        />
      </Page>
    </DarkOneGradient>
  );
}

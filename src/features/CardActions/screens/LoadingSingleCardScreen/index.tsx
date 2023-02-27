import { useEffect } from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";

import DarkOneGradient from "@/components/LinearGradients/GradientBackgrounds";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

export default function LoadingSingleCardScreen() {
  const mainViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
    flex: 1,
    justifyContent: "center",
  }));
  const loadingIndicatorColor = useThemeStyles(theme => theme.palette["neutralBase-50"], ["neutralBase-50"]);

  useEffect(() => {
    /* should call here the creation API */
  }, []);

  return (
    <DarkOneGradient>
      <Page>
        <NavHeader withBackButton color="white" />
        <View style={mainViewStyle}>
          <ActivityIndicator color={loadingIndicatorColor} size="small" />
        </View>
      </Page>
    </DarkOneGradient>
  );
}

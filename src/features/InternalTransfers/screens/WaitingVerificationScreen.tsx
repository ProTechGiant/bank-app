import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function WaitingVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const indicatorContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <Page>
      <ContentContainer>
        <Pressable style={styles.main} onPress={() => navigation.navigate("InternalTransfers.ConfirmationScreen")}>
          <ActivityIndicator size="large" style={indicatorContainerStyle} />
          <Typography.Text color="neutralBase+30" size="title3" weight="medium">
            {t("InternalTransfers.WaitingVerificationScreen.waitingVerification")}
          </Typography.Text>
          <Typography.Text align="center" color="neutralBase" size="callout" weight="regular">
            {t("InternalTransfers.WaitingVerificationScreen.waitingMessage")}
          </Typography.Text>
        </Pressable>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

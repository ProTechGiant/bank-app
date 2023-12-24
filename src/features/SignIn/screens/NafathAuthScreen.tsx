import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import Accordion from "@/components/Accordion";
import FullScreenLoader from "@/components/FullScreenLoader";
import { LinkCard } from "@/components/LinkComponent";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Tag from "@/components/Tag";
import Typography from "@/components/Typography";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useSignInContext } from "../contexts/SignInContext";
import { useRequestNumberPanic, useRequestNumberResetPassCode } from "../hooks/query-hooks";

export default function NafathAuthScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { isPanicMode } = useSignInContext();

  const { mutateAsync: getTransactionNumberForPanic, isLoading: panicLoading } = useRequestNumberPanic();
  const { mutateAsync: getTransactionNumberForResetPasscode, isLoading: passCodeLoading } =
    useRequestNumberResetPassCode();

  const [isReachLimit, setIsReachLimit] = useState<boolean>(false);

  const handleNavigate = async () => {
    try {
      const response = isPanicMode
        ? await getTransactionNumberForPanic()
        : await getTransactionNumberForResetPasscode();

      const randomValue = response?.Body?.random || "";

      navigation.navigate("SignIn.NafathCode", { nafathCode: randomValue });
    } catch (err) {
      setIsReachLimit(true);
    }
  };

  const container = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["24p"],
    flex: 1,
  }));

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
    marginTop: theme.spacing["16p"],
    gap: theme.spacing["8p"],
  }));

  const subTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["4p"],
    width: "80%",
  }));

  const tagContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "flex-start",
    marginBottom: theme.spacing["8p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        withBackButton={true}
        title={t("NafathAuthScreen.navHeaderTitle")}
        testID="Onboarding.NafathAuthScreen:NavHeader"
      />
      {panicLoading || passCodeLoading ? (
        <View style={styles.loading}>
          <FullScreenLoader />
        </View>
      ) : (
        <View style={container}>
          <View style={headerContainerStyle}>
            <Typography.Text size="title1" weight="medium">
              {t("NafathAuthScreen.title")}
            </Typography.Text>
            <Typography.Text size="callout" weight="regular">
              {t("NafathAuthScreen.subTitle")}
            </Typography.Text>
          </View>
          <Stack align="stretch" direction="vertical" gap="20p">
            <LinkCard onNavigate={handleNavigate} testID="Onboarding.NafathAuthScreen:SelectNafathAppButton">
              <View style={tagContainerStyle}>
                <Tag title="Nafath app" variant="pink" />
              </View>
              <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                {t("NafathAuthScreen.appButtonTitle")}
                {t("NafathAuthScreen.appButtonSubtitle")}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase" style={subTextStyle}>
                {t("NafathAuthScreen.appButtonBody")}
              </Typography.Text>
            </LinkCard>
            <Accordion title={t("NafathAuthScreen.dropdownTitle")}>
              <Typography.Text color="neutralBase+10" size="footnote">
                {t("NafathAuthScreen.dropdownBody")}
              </Typography.Text>
            </Accordion>
          </Stack>
        </View>
      )}
      <NotificationModal
        testID="SignIn.PanicModeScreen:ErrorModal"
        variant="error"
        title={t("SignIn.Modal.error.authenticationFailed")}
        message={t("SignIn.Modal.error.panic.reachLimitSubTitle")}
        isVisible={isReachLimit}
        onClose={() => setIsReachLimit(false)}
      />
    </Page>
  );
}
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: -49,
  },
});

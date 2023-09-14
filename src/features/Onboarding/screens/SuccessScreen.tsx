import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, useWindowDimensions, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToasts } from "@/contexts/ToastsContext";
import { useThemeStyles } from "@/theme";

import AccountCreated from "../assets/account-created.svg";
import { useAccountStatus } from "../hooks/query-hooks";
import { Status } from "../types";

export default function SuccessScreen() {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const addToast = useToasts();
  const [isfetchingAccountStatus, setIsfetchingAccountStatus] = useState(true);
  const { data, refetch } = useAccountStatus(isfetchingAccountStatus);
  const auth = useAuthContext();

  const accountStatus: Status | undefined = data?.OnboardingStatus as Status;

  useEffect(() => {
    if (accountStatus === "COMPLETED") {
      setIsfetchingAccountStatus(false);
      //TODO: Toast creates branding design system inconsistency that would need to be fixed in the future
      addToast({
        variant: "success",
        message: t("Onboarding.LandingScreen.success.bannerMessage"),
        closable: true,
      });
    } else if (accountStatus === "DECLINED") {
      setIsfetchingAccountStatus(false);
    }
  }, [accountStatus, refetch, t, addToast]);

  const handleOnGetStartedPress = () => {
    //TODO: WILL JUST AUTHENTICATE THE USER WITHOUT USER ID AS WE STARTED SAVING AUTH TOKEN
    if (auth.userId) auth.authenticate(auth.userId);
  };

  const headerSuccessStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["20p"],
  }));

  const svgHeight = height * 0.55; // Adjust the height as needed
  const svgWidth = svgHeight * 0.75; // Adjust the aspect ratio as needed

  return (
    <Page backgroundColor="primaryBase">
      <NavHeader withBackButton={false} />
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <ContentContainer>
        <Stack direction="vertical" flex={1} justify="space-between" gap="24p" align="stretch">
          <View style={headerSuccessStyle}>
            <AccountCreated height={svgHeight} width={svgWidth} />
            <Stack direction="vertical" align="center" gap="8p">
              <Typography.Text align="center" size="xlarge" weight="bold" color="neutralBase-60">
                {t("Onboarding.LandingScreen.success.title")}
              </Typography.Text>
              <Typography.Text align="center" size="callout" weight="regular" color="neutralBase-60">
                {t("Onboarding.LandingScreen.success.subtitle")}
              </Typography.Text>
            </Stack>
          </View>
        </Stack>

        <View style={buttonContainerStyle}>
          <Button color="dark" onPress={handleOnGetStartedPress}>
            {t("Onboarding.LandingScreen.pending.successTitle")}
          </Button>
        </View>
      </ContentContainer>
    </Page>
  );
}

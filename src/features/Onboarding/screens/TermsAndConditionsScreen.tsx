import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import MarkedSVG from "../assets/marked.svg";
import UnMarkedSVG from "../assets/unmarked.svg";
import { useOnboardingBackButton } from "../hooks";
import { useConfirmTermsConditions } from "../hooks/query-hooks";

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation<UnAuthenticatedStackParams>();
  const { t } = useTranslation();
  const termsConditionsAsync = useConfirmTermsConditions();
  const handleOnBackPress = useOnboardingBackButton();
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const handleOnSubmit = async () => {
    try {
      await termsConditionsAsync.mutateAsync();
      navigation.navigate("Onboarding.PendingAccount");
    } catch (error) {
      const hasMessage = (error as ApiError<ResponseError>)?.errorContent?.Message;

      if (hasMessage) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore need to sort this out?
        Alert.alert(t(hasMessage));
      } else {
        Alert.alert(t("Onboarding.TermsAndConditions.errorText.alert"));
      }

      warn("onboarding", "Could not confirm terms and conditions: ", JSON.stringify(error));
    }
  };

  const footerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["32p"],
  }));

  const termsAndConditionLabelContainerStyle = useThemeStyles<TextStyle>(theme => ({
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutralBase,
  }));

  const checkboxLabelContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        onBackPress={handleOnBackPress}
        title={t("Onboarding.TermsAndConditions.navHeaderTitle")}
        withBackButton={true}
        testID="Onboarding.TermsAndConditionsScreen:NavHeader">
        <ProgressIndicator currentStep={5} totalStep={6} />
      </NavHeader>
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="32p" align="stretch">
          <Typography.Header size="large" weight="bold">
            {t("Onboarding.TermsAndConditions.title")}
          </Typography.Header>
          <Stack direction="horizontal" gap="8p" align="flex-start">
            <Pressable onPress={() => setIsTermsChecked(!isTermsChecked)}>
              {isTermsChecked ? <MarkedSVG /> : <UnMarkedSVG />}
            </Pressable>
            <Stack direction="vertical" style={checkboxLabelContainerStyle}>
              <Stack direction="horizontal">
                <Typography.Text size="footnote" weight="regular" color="neutralBase">
                  {t("Onboarding.TermsAndConditions.agreeTo")}
                </Typography.Text>
                <Pressable
                  style={termsAndConditionLabelContainerStyle}
                  onPress={() => navigation.navigate("Onboarding.TermsAndConditionsDetails")}>
                  <Typography.Text size="footnote" weight="medium" color="neutralBase">
                    {t("Onboarding.TermsAndConditions.termsAndCondition")}
                  </Typography.Text>
                </Pressable>
              </Stack>
              <Typography.Text
                size="footnote"
                weight="regular"
                color="neutralBase"
                style={styles.acknowledgeLabelStyle}>
                {t("Onboarding.TermsAndConditions.acknowledge")}
              </Typography.Text>
            </Stack>
          </Stack>
        </Stack>
      </ContentContainer>
      <View style={footerStyle}>
        <Button onPress={handleOnSubmit} disabled={!isTermsChecked}>
          {t("Onboarding.TermsAndConditions.continue")}
        </Button>
      </View>
    </Page>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  acknowledgeLabelStyle: {
    marginLeft: 1,
  },
});

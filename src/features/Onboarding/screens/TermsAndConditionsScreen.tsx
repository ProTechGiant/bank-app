import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import ResponseError from "@/api/ResponseError";
import { Link } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { CheckboxInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import UnAuthenticatedStackParams from "@/navigation/UnAuthenticatedStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

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

  const checkboxLabelContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["12p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader onBackPress={handleOnBackPress} title={t("Onboarding.TermsAndConditions.header")} />
      <ContentContainer isScrollView>
        <Stack direction="vertical" gap="24p" align="stretch">
          <Typography.Header size="large" weight="medium">
            {t("Onboarding.TermsAndConditions.title")}
          </Typography.Header>
          <Stack direction="horizontal" gap="8p" align="flex-start">
            <CheckboxInput
              onChange={() => setIsTermsChecked(!isTermsChecked)}
              value={isTermsChecked}
              isEditable={true}
            />
            <Stack direction="vertical" style={checkboxLabelContainerStyle}>
              <Stack direction="horizontal">
                <Typography.Text size="footnote" weight="regular" color="neutralBase">
                  {t("Onboarding.TermsAndConditions.agreeTo")}
                </Typography.Text>
                <Link
                  children={t("Onboarding.TermsAndConditions.termsAndCondition")}
                  onPress={() => navigation.navigate("Onboarding.TermsAndConditionsDetails")}
                />
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
        <Button loading={termsConditionsAsync.isLoading} onPress={handleOnSubmit} disabled={!isTermsChecked}>
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

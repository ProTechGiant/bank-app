import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, View, ViewStyle } from "react-native";

import ApiError from "@/api/ApiError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ApiOnboardingError from "../../types/ApiOnboardingError";
import IqamaInputs from "./IqamaInputs";
import MobileAndNationalIdForm from "./MobileAndNationalId/MobileAndNationalIdForm";
import useIqama from "./use-iqama";

export default function IqamaInputScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutateAsync } = useIqama();

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.xlarge,
  }));

  const bodyStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing.medium,
    flex: 1,
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing.large,
  }));

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing.large,
    marginHorizontal: theme.spacing.medium,
  }));

  const handleOnSignIn = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      await mutateAsync(values);
      navigation.navigate("Onboarding.Nafath");
    } catch (error) {
      Alert.alert(
        "Sorry, could not complete your request",
        error instanceof ApiError<ApiOnboardingError> ? error.errorContent.Message : undefined
      );
    }
  };

  return (
    <Page>
      <NavHeader title={t("Onboarding.IqamaInputScreen.navHeaderTitle")} backButton={true} barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={headerViewStyle}>
          <Typography.Text size="large" weight="bold" style={headerTitleStyle}>
            {t("Onboarding.IqamaInputScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subTitle")}
          </Typography.Text>
        </View>
        <View style={bodyStyle}>
          <MobileAndNationalIdForm onSubmit={handleOnSubmit} />
          <View style={accountSignInStyle}>
            <Typography.Text size="callout" weight="regular">
              {t("Onboarding.IqamaInputScreen.subtext")}
            </Typography.Text>
            <Pressable onPress={handleOnSignIn}>
              <Typography.Text size="callout" weight="regular" color="tintBase">
                {t("Onboarding.IqamaInputScreen.signIn")}
              </Typography.Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}

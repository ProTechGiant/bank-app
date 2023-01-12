import { Alert, Pressable, SafeAreaView, ScrollView, View, ViewStyle } from "react-native";

import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import IqamaInputs from "./IqamaInputs";
import MobileAndNationalIdForm from "./MobileAndNationalId/MobileAndNationalIdForm";
import useSubmitIqama from "./use-submit-iqama";

export default function IqamaInputScreen() {
  const accountSignInStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignSelf: "center",
      flexDirection: "row",
      marginTop: theme.spacing.small,
    }),
    []
  );
  const bodyStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      flex: 1,
    }),
    []
  );
  const headerTitleStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginVertical: theme.spacing.large,
    }),
    []
  );
  const headerViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.large,
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );
  const navigation = useNavigation();
  const submitIqamaSync = useSubmitIqama();

  const ButtonPressed = () => {
    Alert.alert("signin button pressed");
  };

  const handleOnSubmit = async (values: IqamaInputs) => {
    try {
      await submitIqamaSync.mutateAsync(values).then(() => navigation.navigate("Onboarding.Nafath"));
    } catch (error) {
      __DEV__ && console.error(error);
    }
  };

  return (
    <SafeAreaView style={container}>
      <NavHeader title="SIGN UP" backButton={true} barStyle="dark-content" />
      <ScrollView>
        <View style={headerViewStyle}>
          <Typography.Text size="large" weight="bold" style={headerTitleStyle}>
            Let's go
          </Typography.Text>

          <Typography.Text size="callout" weight="regular">
            Let's start with your contact and ID details:
          </Typography.Text>
        </View>
        <View style={bodyStyle}>
          <MobileAndNationalIdForm onSubmit={handleOnSubmit} />
          <View style={accountSignInStyle}>
            <Typography.Text size="callout" weight="regular">
              Already with us?{" "}
            </Typography.Text>
            <Pressable onPress={ButtonPressed}>
              <Typography.Text size="callout" weight="regular" color="tintBase">
                Sign in here
              </Typography.Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

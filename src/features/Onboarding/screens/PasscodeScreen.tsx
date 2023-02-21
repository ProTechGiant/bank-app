import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

const PasscodeScreen = () => {
  const navigation = useNavigation();

  const backToStart = () => {
    navigation.navigate("Onboarding.SplashScreen");
  };

  return (
    <Page>
      <NavHeader title="Your PIN" withBackButton={false} color="black" end="close" />
      <Typography.Text>Your Passcode</Typography.Text>
      <Button onPress={backToStart}>Back to Start</Button>
    </Page>
  );
};

export default PasscodeScreen;

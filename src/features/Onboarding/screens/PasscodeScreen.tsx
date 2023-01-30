import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

const PasscodeScreen = () => {
  return (
    <Page>
      <NavHeader title="Your PIN" backButton={true} barStyle="dark-content" rightComponent="close" />
      <Typography.Text>Your Passcode</Typography.Text>
    </Page>
  );
};

export default PasscodeScreen;

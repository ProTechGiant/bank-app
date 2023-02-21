import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

export default function OneTimePasswordScreen() {
  const navigation = useNavigation();

  const onClosePress = () => {
    navigation.navigate("Temporary.LandingScreen");
  };

  return (
    <Page>
      <NavHeader end={<NavHeader.CloseEndButton onPress={onClosePress} />} />
      <Typography.Text>Card OTP</Typography.Text>
    </Page>
  );
}

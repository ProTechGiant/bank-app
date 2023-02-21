import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

export default function CardDetailsScreen() {
  const navigation = useNavigation();

  const onHandlePressSettings = () => {
    navigation.navigate("CardActions.CardSettingsScreen");
  };

  return (
    <Page>
      <NavHeader end={false} />
      <ContentContainer>
        <Typography.Text>Card Details</Typography.Text>
        <Button onPress={onHandlePressSettings}>Card Settings</Button>
      </ContentContainer>
    </Page>
  );
}

import { Typography } from "@/components";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

export default function EmkanTempScreenScreen() {
  const navigation = useNavigation();

  // TODO: this is temp screen not implemented yet

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title="EmkanTempScreenScreen" end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      <ContentContainer>
        <Typography.Text color="primaryBase" size="title3" weight="bold">
          EmkanTempScreenScreen
        </Typography.Text>
      </ContentContainer>
    </Page>
  );
}

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

export default function TemporaryDummyScreen() {
  return (
    <Page>
      <NavHeader withBackButton />
      <ContentContainer>
        <Typography.Header>Dummy Screen</Typography.Header>
      </ContentContainer>
    </Page>
  );
}

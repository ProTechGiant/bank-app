import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

// TODO: TemporarySubscriptionManagementScreen will be removed once implemented by Smart Choices Domain team

export default function TemporarySubscriptionManagementScreen() {
  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "bottom"]}>
      <NavHeader />
      <Typography.Header>Temporary Subscription Management Screen</Typography.Header>
    </Page>
  );
}

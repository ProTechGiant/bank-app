import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";

export default function CardSettingsScreen() {
  return (
    <Page>
      <NavHeader end={false} />
      <Typography.Text>Card Settings</Typography.Text>
    </Page>
  );
}

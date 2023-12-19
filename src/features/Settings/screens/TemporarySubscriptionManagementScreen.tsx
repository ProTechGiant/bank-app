import { StatusBar } from "react-native";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

// TODO: TemporarySubscriptionManagementScreen will be removed once implemented by Smart Choices Domain team

export default function TemporarySubscriptionManagementScreen() {
  const whiteColor = useThemeStyles<string>(theme => theme.palette.transparent);
  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "bottom"]}>
      <NavHeader />
      <StatusBar barStyle="dark-content" backgroundColor={whiteColor} />
      <Typography.Header>Temporary Subscription Management Screen</Typography.Header>
    </Page>
  );
}

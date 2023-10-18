import { Platform, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import Button from "@/components/Button";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { HeaderContent, MutualFundDashboardHeaderContent, SliderProgressBar } from "../components";

export default function MutualFundDetailsScreen() {
  const navigation = useNavigation();

  const headerContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: Platform.OS === "android" ? -theme.spacing["16p"] : -theme.spacing["24p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <View style={headerContainerStyle}>
        <HeaderContent headerTitle="Mutual Fund Details" showInfoIndicator={true}>
          <Stack direction="vertical" gap="24p">
            <Typography.Text color="neutralBase-60">TODO: this content just for test</Typography.Text>
            <MutualFundDashboardHeaderContent />
          </Stack>
        </HeaderContent>
      </View>
      <Stack direction="vertical" style={{ marginTop: 48 }} gap="24p" align="center">
        <SliderProgressBar />
        <Typography.Text>TODO: All this page's UI in progress</Typography.Text>
        <Button
          onPress={() => {
            navigation.navigate("MutualFund.Subscription");
          }}>
          {/* TODO: will be replaced from translation */}
          Go to Subscription Screen
        </Button>
      </Stack>
    </Page>
  );
}

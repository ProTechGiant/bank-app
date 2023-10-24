import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, ViewStyle } from "react-native";

import ContentContainer from "@/components/ContentContainer";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import {
  AssetSection,
  MutualFundBottomSection,
  MutualFundDetailsHeader,
  MutualFundDetailsNavHeader,
  MutualFundInvestmentDetails,
  MutualFundSubscriptionDetails,
  SliderProgressBar,
} from "../components";
import { MutualFundStackParams } from "../MutualFundStack";

export default function MutualFundDetailsScreen() {
  const route = useRoute<RouteProp<MutualFundStackParams, "MutualFund.MutualFundDetailsScreen">>();

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["24p"],
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" insets={["bottom"]}>
      <MutualFundDetailsNavHeader />
      <ScrollView style={{ flex: 1 }}>
        <MutualFundDetailsHeader />
        <ContentContainer style={contentContainerStyle}>
          <SliderProgressBar productId={route.params.id} />
          <MutualFundInvestmentDetails />
          <AssetSection />
          <MutualFundSubscriptionDetails />
          <MutualFundBottomSection />
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

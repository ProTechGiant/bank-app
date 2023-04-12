import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

export default function TransactionDetailsScreen() {
  const navigation = useNavigation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleOnBackPress} />
        <ContentContainer>
          <Typography.Text>Transaction Details Screen</Typography.Text>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

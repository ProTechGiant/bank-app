import React from "react";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
    </Page>
  );
}

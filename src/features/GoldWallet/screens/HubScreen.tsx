import { StackActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import useNavigation from "@/navigation/use-navigation";

import { useWallet } from "../hooks/query-hooks";

export default function HubScreen() {
  const navigation = useNavigation();
  const { refetch, isLoading, isError, data: walletData } = useWallet();

  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

  //TODO change this condition to the correct one on integration
  if (walletData === undefined) {
    navigation.dispatch(StackActions.replace("GoldWallet.OnboardingScreen"));
  }

  useEffect(() => {
    if (isError) setIsErrorModalVisible(isError);
  }, [isError]);

  return (
    <Page backgroundColor="neutralBase-60">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <NavHeader withBackButton={false} end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
      )}
      <LoadingErrorNotification
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        onRefresh={refetch}
      />
    </Page>
  );
}

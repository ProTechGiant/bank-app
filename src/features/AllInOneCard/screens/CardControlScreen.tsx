import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FullScreenLoader from "@/components/FullScreenLoader";
import { LoadingErrorNotification } from "@/components/LoadingError";
import NavHeader from "@/components/NavHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";

import { SettingsIcon } from "../assets/icons";
import { CardManagement, VisaCard } from "../components";
import { useGetCardDetails, useGetSettings } from "../hooks/query-hooks";
import { CardTypes } from "../types";

export default function CardControlScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { allInOneCardType } = useAuthContext();
  //TODO :Will make it dynamic after api integration
  const {
    data: visaDetails,
    isLoading: isLoadingVisaDetails,
    isError,
    refetch,
  } = useGetCardDetails({ id: "1", type: "neraPlus" });

  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
    isError: isErrorSettings,
  } = useGetSettings({ cardId: "40545400183678185477" }); //TODO :Will make it dynamic after api integration
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState<boolean>(false);
  useEffect(() => {
    setIsLoadingErrorVisible(isError || isErrorSettings);
  }, [isError]);

  const isNera = allInOneCardType === CardTypes.NERA;

  const handleOnBackButtonPress = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };
  const handleOnRefresh = () => {
    refetch();
    refetchSettings();
  };

  const handleNavigateToSettings = () => {
    navigation.navigate("AllInOneCard.SettingsScreen");
  };

  return (
    <SafeAreaView style={styles.container} testID="AllInOneCard.CardControlScreen:SafeAreaView">
      <StatusBar backgroundColor="#1E1A25" />
      <NavHeader
        title={t("AllInOneCard.Dashboard.title")}
        variant="white"
        onBackPress={handleOnBackButtonPress}
        end={
          <Pressable onPress={handleNavigateToSettings}>
            <SettingsIcon />
          </Pressable>
        }
        backgroundColor="#1E1A25"
        testID="AllInOneCard.CardControlScreen:NavHeader"
      />
      {isLoadingVisaDetails || isLoadingSettings ? (
        <FullScreenLoader />
      ) : visaDetails !== undefined && settings !== undefined ? (
        <>
          <VisaCard visaCardData={visaDetails} isNera={isNera} />
          <CardManagement settings={settings.Restrictions} />
        </>
      ) : null}
      <LoadingErrorNotification
        onRefresh={handleOnRefresh}
        isVisible={isLoadingErrorVisible}
        onClose={() => setIsLoadingErrorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1A25",
    flex: 1,
  },
});

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
import { useGetCardDetails } from "../hooks/query-hooks";
import { CardTypes } from "../types";

export default function CardControlScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { allInOneCardType } = useAuthContext();
  //TODO :Will make it dynamic after api integration
  const { data: visaDetails, isLoading, isError, refetch } = useGetCardDetails({ id: "1", type: "neraPlus" });
  const [isLoadingErrorVisible, setIsLoadingErrorVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingErrorVisible(isError);
  }, [isError]);

  const isNera = allInOneCardType === CardTypes.NERA;

  const handleOnBackButtonPress = () => {
    navigation.navigate("Home.HomeTabs", { screen: "Cards" });
  };

  const handleNavigateToSettings = () => {
    navigation.navigate("AllInOneCard.SettingsScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
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
      />
      {isLoading ? (
        <FullScreenLoader />
      ) : visaDetails !== undefined ? (
        <>
          <VisaCard visaCardData={visaDetails} isNera={isNera} />
          <CardManagement />
        </>
      ) : null}
      <LoadingErrorNotification
        onRefresh={() => refetch()}
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

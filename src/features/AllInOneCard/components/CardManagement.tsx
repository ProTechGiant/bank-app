import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuthContext } from "@/contexts/AuthContext";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { AppleWalletIcon, AppleWalletIconAr, GiftIcon, TopSlantBorder } from "../assets/icons";
import { Restriction } from "../types";
import CardSettings from "./CardSettings";

interface CardManagementProps {
  settings?: Restriction[];
  isSettingLoading: boolean;
}

export default function CardManagement({ settings, isSettingLoading }: CardManagementProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { hasAppliedPhysicalCard } = useAuthContext();
  const handleOrderPhysicalAddress = () => {
    navigation.navigate("AllInOneCard.DeliveryAddressScreen");
  };

  const dividerStyle = useThemeStyles<ViewStyle>(theme => ({
    height: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-40"],
    width: "100%",
    marginVertical: theme.spacing["12p"],
  }));
  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
    marginTop: -theme.spacing["8p"],
    backgroundColor: "#fff",
  }));
  const getCardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["12p"],
  }));
  const appleWalletBtnContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    marginBottom: hasAppliedPhysicalCard ? theme.spacing["32p"] : theme.spacing["16p"],
  }));

  const loadingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.hightTriangle}>
        <TopSlantBorder />
      </View>
      <ScrollView style={contentContainerStyle} testID="AllInOneCard.CardControlScreen:ScrollView">
        <View style={styles.content}>
          <View style={appleWalletBtnContainerStyle}>
            <Pressable testID="AllInOneCard.CardControlScreen:AppleWalletPresable">
              {I18nManager.isRTL ? <AppleWalletIconAr width="100%" /> : <AppleWalletIcon width="100%" />}
            </Pressable>
          </View>
          {hasAppliedPhysicalCard ? (
            <></>
          ) : (
            <>
              <View style={dividerStyle} />
              <Pressable onPress={handleOrderPhysicalAddress} testID="AllInOneCard.CardControlScreen:cardPressable">
                <Stack direction="horizontal" justify="space-between" align="center" style={getCardContainerStyle}>
                  <Stack direction="horizontal" align="center" gap="16p">
                    <GiftIcon />
                    <Typography.Text weight="medium" size="callout">
                      {t("AllInOneCard.CardControlScreen.getCard")}
                    </Typography.Text>
                  </Stack>
                  <View style={styles.transformArrow}>
                    <ChevronRightIcon color="#ACABBA" />
                  </View>
                </Stack>
              </Pressable>
              <View style={dividerStyle} />
            </>
          )}
          {isSettingLoading ? (
            <View style={loadingStyle}>
              <FullScreenLoader />
            </View>
          ) : settings !== undefined ? (
            <CardSettings settings={settings} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  hightTriangle: {
    height: 44,
  },
  transformArrow: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

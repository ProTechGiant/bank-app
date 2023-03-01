import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Alert, Platform, View, ViewStyle } from "react-native";

import { CardSettingsIcon, ReportIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import ListItemLink from "../../components/ListItemLink";
import ListSection from "../../components/ListSection";
import CardIconButtons from "./CardIconButtons";
import ListItemText from "./ListItemText";
import SingleUseIconButtons from "./SingleUseIconButtons";
import UpgradeToCroatiaPlus from "./UpgradeToCroatiaPlus";

export default function CardDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParams, "CardActions.CardDetailsScreen">>();
  const { t } = useTranslation();

  const cardType = route.params.cardType;

  const handleOnAddToAppleWallet = () => {
    navigation.navigate("Temporary.LandingScreen"); //to do: navigate to dummy screen
  };

  const handleOnPressSettings = () => {
    navigation.navigate("CardActions.CardSettingsScreen");
  };

  const handleOnPressReport = () => {
    Alert.alert("Report stolen or damaged");
  };

  const handleOnUpgradePress = () => {
    // ..
  };

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    paddingBottom: theme.spacing["24p"],
  }));

  const separatorStyle = useThemeStyles<ViewStyle>(theme => ({
    height: 1,
    backgroundColor: theme.palette["neutralBase-30"],
    marginHorizontal: -theme.spacing["20p"],
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["20p"],
  }));

  const walletButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Page backgroundColor="neutralBase-50">
      <NavHeader
        title={
          cardType === "standard"
            ? t("CardActions.CardDetailsScreen.navTitleStandard")
            : cardType === "plus"
            ? t("CardActions.CardDetailsScreen.navTitlePlus")
            : t("CardActions.CardDetailsScreen.navTitleSingleUse")
        }
        end={false}
      />
      <ContentContainer isScrollView>
        <View style={cardContainerStyle}>
          <BankCard.Active cardNumber="0238" cardType={cardType} />
        </View>
        {cardType === "single-use" ? <SingleUseIconButtons /> : <CardIconButtons />}
        <View style={separatorStyle} />
        {cardType !== "single-use" && (
          <>
            {Platform.OS === "ios" && (
              <View style={walletButtonContainer}>
                <Button onPress={handleOnAddToAppleWallet}>Add to Apple Wallet</Button>
              </View>
            )}
            <ListSection title={t("CardActions.CardDetailsScreen.manageCardHeader")}>
              <ListItemLink
                icon={<CardSettingsIcon />}
                onPress={handleOnPressSettings}
                title={t("CardActions.CardDetailsScreen.cardSettingsButton")}
              />
              <ListItemLink
                icon={<ReportIcon />}
                onPress={handleOnPressReport}
                title={t("CardActions.CardDetailsScreen.reportButton")}
              />
            </ListSection>
            <View style={separatorStyle} />
          </>
        )}
        <ListSection title={t("CardActions.CardDetailsScreen.accountHeader")}>
          <ListItemText title={t("CardActions.CardDetailsScreen.accountNumber")} value="1234 1234 1234 1234" />
          <ListItemText title={t("CardActions.CardDetailsScreen.accountName")} value="Main account" />
        </ListSection>
        {cardType === "standard" && (
          <>
            <View style={separatorStyle} />
            <UpgradeToCroatiaPlus onPress={handleOnUpgradePress} />
          </>
        )}
      </ContentContainer>
    </Page>
  );
}

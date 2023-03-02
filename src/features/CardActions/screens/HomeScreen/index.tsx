import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SingleUseCardsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnPlusCardPress = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.CardDetailsScreen",
      params: { cardType: "plus" },
    });
  };

  const handleOnStandardCardPress = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.CardDetailsScreen",
      params: { cardType: "standard" },
    });
  };

  const handleOnSingleUseCardPress = () => {
    navigation.navigate("CardActions.CardActionsStack", {
      screen: "CardActions.CardDetailsScreen",
      params: { cardType: "single-use" },
    });
  };

  const handleOnPressAbout = () => {
    navigation.navigate("CardActions.SingleUseCardAbout");
  };

  const infoIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.cardInfo);

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const handleOnGenerateCardPress = () => {
    navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.SingleUseCardInfo" });
  };

  return (
    <Page>
      <NavHeader title={t("Cards.HomeScreen.navTitle")} end={false} />
      <ScrollView horizontal style={cardContainerStyle}>
        <Stack direction="horizontal" gap="20p">
          <BankCard.Active
            cardNumber="4433"
            cardType="plus"
            endButton={
              <ContextMenu
                actions={[
                  {
                    title: t("CardActions.QuickMenu.freezeCard"),
                    systemIcon: "thermometer.snowflake",
                  },
                  {
                    title: t("CardActions.QuickMenu.viewPin"),
                    systemIcon: "lock",
                  },
                  {
                    title: t("CardActions.QuickMenu.settings"),
                    systemIcon: "gearshape",
                  },
                ]}
                dropdownMenuMode={true}>
                <BankCard.EndButton icon={<ThreeDotsIcon />} />
              </ContextMenu>
            }
            onPress={handleOnPlusCardPress}
          />
          <BankCard.Active
            cardNumber="0238"
            cardType="single-use"
            endButton={
              <Pressable onPress={handleOnPressAbout}>
                <BankCard.EndButton icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />} />
              </Pressable>
            }
            onPress={handleOnSingleUseCardPress}
          />
          <BankCard.Inactive
            endButton={
              <Pressable onPress={handleOnPressAbout}>
                <BankCard.EndButton icon={<InfoCircleIcon />} />
              </Pressable>
            }
            label={t("Cards.singleUseCard")}
            actionButton={<BankCard.ActionButton title={t("Cards.generateNew")} onPress={handleOnGenerateCardPress} />}
          />
        </Stack>
      </ScrollView>
    </Page>
  );
}

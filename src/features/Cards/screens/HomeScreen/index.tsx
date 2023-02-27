import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, ViewStyle } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import { InfoCircleIcon, ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";
import ContentContainer from "@/components/ContentContainer";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const isFreezeCardActive = true; // @TODO BE integration
  const isViewPinActive = true; // @TODO BE integration

  const contextMenuActions: ContextMenuItem[] = [
    {
      id: 1,
      title: isCardFrozen ? t("CardActions.QuickMenu.defrost") : t("CardActions.QuickMenu.freezeCard"),
      systemIcon: isCardFrozen ? "thermometer.snowflake" : "snowflake",
      disabled: !isFreezeCardActive,
    },
    {
      id: 2,
      title: t("CardActions.QuickMenu.viewPin"),
      systemIcon: "lock",
      disabled: !isViewPinActive,
    },
    {
      id: 3,
      title: t("CardActions.QuickMenu.settings"),
      systemIcon: "gearshape",
    },
  ];

  const handleOnFreezeUnfreezeCardPress = () => {
    setIsCardFrozen(!isCardFrozen); // TODO: BE integration. update icon for now
    Alert.alert("Freeze/Unfreeze card is coming");
  };

  const handleOnViewPinPress = () => {
    Alert.alert("View Pin is coming");
  };

  const handleOnCardSettingsPress = () => {
    navigation.navigate("CardActions.CardActionsStack", { screen: "CardActions.CardSettingsScreen" });
  };

  const handleOnInfoPress = () => {
    Alert.alert("Single card info is coming");
  };

  const infoIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-50"]);
  const infoIconDimensions = useThemeStyles<number>(theme => theme.iconDimensions.cardInfo);

  const cardContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <Page>
      <NavHeader title={t("Cards.HomeScreen.navTitle")} withBackButton={false} end={false} />
      <ContentContainer>
        <ScrollView horizontal style={cardContainerStyle}>
          <Stack direction="horizontal" gap="20p">
            <BankCard.Active
              cardNumber="0238"
              cardType="plus"
              endButton={
                <ContextMenu
                  actions={contextMenuActions}
                  dropdownMenuMode={true}
                  onPress={e => {
                    e.nativeEvent.index === 0
                      ? handleOnFreezeUnfreezeCardPress()
                      : e.nativeEvent.index === 1
                      ? handleOnViewPinPress()
                      : handleOnCardSettingsPress();
                  }}>
                  <BankCard.EndButton icon={<ThreeDotsIcon />} />
                </ContextMenu>
              }
              label={t("Cards.plusCard")}
            />
            <BankCard.Active
              cardNumber="0238"
              cardType="single-use"
              endButton={
                <Pressable onPress={handleOnInfoPress}>
                  <BankCard.EndButton
                    icon={<InfoCircleIcon width={infoIconDimensions} height={infoIconDimensions} />}
                  />
                </Pressable>
              }
              label={t("Cards.singleUseCard")}
            />
          </Stack>
        </ScrollView>
      </ContentContainer>
    </Page>
  );
}

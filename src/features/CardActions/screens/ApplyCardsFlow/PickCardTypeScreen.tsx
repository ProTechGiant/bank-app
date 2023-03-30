import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { SceneMap, TabBar, TabBarIndicator, TabView } from "react-native-tab-view";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { LUX_CARD_PRODUCT_ID, PHYSICAL_CARD_TYPE, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { CardActionsStackParams } from "../../CardActionsStack";
import { SelectLuxCard, SelectStandardCard } from "../../components";
import { useOrderCardContext } from "../../context/OrderCardContext";

export default function PickCardTypeScreen() {
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<CardActionsStackParams, "CardActions.PickCardType">>();

  const navigation = useNavigation();
  const [index, setIndex] = useState(
    route.params?.productId === undefined ? 0 : route.params?.productId === STANDARD_CARD_PRODUCT_ID ? 0 : 1
  );

  const tabBarIndicatorStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-40"],
  }));

  const tabBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    borderBottomColor: theme.palette["neutralBase-20"],
    borderBottomWidth: 0.5,
  }));

  const tabLabelStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["primaryBase-40"],
  }));

  const handleOnCardPress = (cardType: "standard" | "lux") => {
    setOrderCardValues(current => ({
      ...current,
      formValues: {
        ...orderCardValues.formValues,
        CardType: PHYSICAL_CARD_TYPE,
        CardProductId: cardType === "standard" ? STANDARD_CARD_PRODUCT_ID : LUX_CARD_PRODUCT_ID,
      },
    }));

    navigation.navigate("CardActions.SetPinAndAddress", { cardId: route.params?.cardId });
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "left", "right"]}>
      <NavHeader
        title={route.params?.cardId ? t("CardActions.CardRenewal.title") : t("ApplyCards.ApplyForCardScreen.navTitle")}
        withBackButton={false}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <TabView
        navigationState={{
          index,

          routes: [
            { key: "standard", title: t("ApplyCards.ApplyForCardScreen.tabs.standard") },

            { key: "lux", title: t("ApplyCards.ApplyForCardScreen.tabs.lux") },
          ],
        }}
        swipeEnabled={route.params?.cardId === undefined}
        renderTabBar={props => (
          <TabBar
            {...props}
            renderIndicator={indicatorProps => {
              const width = indicatorProps.getTabWidth(index);

              return (
                <TabBarIndicator
                  {...indicatorProps}
                  width={width / 2}
                  style={[tabBarIndicatorStyle, { left: width / 4 }]}
                />
              );
            }}
            style={tabBarStyle}
            labelStyle={tabLabelStyle}
            onTabPress={({ preventDefault }) => {
              if (route.params?.cardId !== undefined) {
                preventDefault();
              }
            }} // eslint-disable-next-line @typescript-eslint/no-shadow
            renderLabel={({ route, focused }) => (
              <Typography.Text
                color="neutralBase+30"
                weight="medium"
                size="callout"
                style={{ opacity: focused ? 1 : 0.5 }}>
                {route.title}
              </Typography.Text>
            )}
          />
        )}
        onIndexChange={setIndex}
        renderScene={SceneMap({
          standard: () => (
            <SelectStandardCard
              onPress={() => {
                handleOnCardPress("standard");
              }}
              title={
                route.params?.cardId !== undefined
                  ? t("CardActions.CardRenewal.title")
                  : t("ApplyCards.ApplyForCardScreen.standard.button")
              }
            />
          ),
          lux: () => (
            <SelectLuxCard
              onPress={() => {
                handleOnCardPress("lux");
              }}
              title={
                route.params?.cardId !== undefined
                  ? t("CardActions.CardRenewal.title")
                  : t("ApplyCards.ApplyForCardScreen.lux.button")
              }
              remark={t("ApplyCards.ApplyForCardScreen.lux.remarks")}
            />
          ),
        })}
      />
    </Page>
  );
}

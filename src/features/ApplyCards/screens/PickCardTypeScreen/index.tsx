import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { SceneMap, TabBar, TabBarIndicator, TabView } from "react-native-tab-view";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { LUX_CARD_PRODUCT_ID, PHYSICAL_CARD_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOrderCardContext } from "../../context/OrderCardContext";
import SelectLuxCard from "./SelectLuxCard";
import SelectStandardCard from "./SelectStandardCard";

export default function PickCardTypeScreen() {
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

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
        CardType: PHYSICAL_CARD_ID,
        CardProductId: cardType === "standard" ? STANDARD_CARD_PRODUCT_ID : LUX_CARD_PRODUCT_ID,
      },
    }));

    navigation.navigate("ApplyCards.SetPinAndAddress");
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["top", "left", "right"]}>
      <NavHeader
        title={t("ApplyCards.ApplyForCardScreen.navTitle")}
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
            />
          ),
          lux: () => (
            <SelectLuxCard
              onPress={() => {
                handleOnCardPress("lux");
              }}
            />
          ),
        })}
      />
    </Page>
  );
}

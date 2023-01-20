import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { SceneMap, TabBar, TabBarIndicator, TabView } from "react-native-tab-view";

import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useOrderCardContext } from "../../context/OrderCardContext";
import SelectLuxCard from "./SelectLuxCard";
import SelectStandardCard from "./SelectStandardCard";

const STANDARD_CARD_ID = {
  cardType: 1,
  cardProductId: 1356,
};

export default function PickCardTypeScreen() {
  const { orderCardValues, setOrderCardValues } = useOrderCardContext();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const tabBarIndicatorStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const tabBarStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    marginBottom: 30,
  }));

  const tabLabelStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette["neutralBase+30"],
  }));

  const handleOnLuxCardPress = () => {
    navigation.navigate("ApplyCards.ApplyForLuxCard");
  };

  const handleOnStandardCardPress = () => {
    setOrderCardValues(current => ({
      ...current,
      formValues: {
        ...orderCardValues.formValues,
        ...STANDARD_CARD_ID,
      },
    }));

    navigation.navigate("ApplyCards.SetPinAndAddress");
  };

  return (
    <Page>
      <NavHeader title={t("ApplyCards.ApplyForCardScreen.navTitle")} backButton={false} />
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
          standard: () => <SelectStandardCard onPress={handleOnStandardCardPress} />,
          lux: () => <SelectLuxCard onPress={handleOnLuxCardPress} />,
        })}
      />
    </Page>
  );
}

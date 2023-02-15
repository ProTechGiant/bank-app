import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Reorderer from "@/features/Home/components/Reorderer";
import { quickActionOrderData, quickActionReorderItem } from "@/mocks/quickActionOrderData";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { ItemListContext } from "../context/ItemListContext";

export default function QuickActionsReorderCard() {
  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50-12%"],
      borderColor: theme.palette["neutralBase-50-12%"],
      borderRadius: 20,
      borderStyle: "solid",
      borderWidth: 1,
      color: theme.palette["neutralBase-50"],
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 9,
    }),
    []
  );
  const headerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette.primaryBase,
      flexDirection: "column",
      padding: theme.spacing["20p"],
      paddingTop: 10,
      width: "100%",
    }),
    []
  );

  const minActiveSections = 3;
  const maxActiveSections = 3;
  const [showTitleBar, setShowTitleBar] = useState<boolean>(true);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const navigation = useNavigation(); // Provide the useState to the context via a Context Provider.
  const { t } = useTranslation();
  const { homeScreenLayout, setHomeScreenLayout } = useGlobalContext();
  let itemList: quickActionReorderItem[], setItemList: React.Dispatch<React.SetStateAction<quickActionReorderItem[]>>;
  // Seed with either current or mock data
  if (homeScreenLayout.quickActionOrderData) {
    [itemList, setItemList] = useState(homeScreenLayout.quickActionOrderData);
  } else {
    [itemList, setItemList] = useState(quickActionOrderData);
  }
  const toggleItem = (key: string) => {
    let updatedItemList: quickActionReorderItem[];
    if (setItemList && itemList) {
      updatedItemList = itemList.map(item => {
        if (item.key === key) {
          item["active"] = !item.active;
        }
        return item;
      });
      setItemList(updatedItemList);
    }
  };

  useEffect(() => {
    let numActive = 0;
    itemList.map(item => {
      if (item["active"] === true) {
        numActive = numActive + 1;
      }
    });
    setSaveEnabled(minActiveSections <= numActive && numActive <= maxActiveSections);
  }, [itemList]);

  const handleCancelButton = () => {
    navigation.goBack();
  };

  const handleSaveButton = () => {
    // Now we update the global state to reflect the item list
    // Update the quickActions part of the homeScreenLayout
    if (setHomeScreenLayout && saveEnabled) {
      const newHomeScreenLayout = {
        quickActionOrderData: itemList,
        homepageOrderData: homeScreenLayout.homepageOrderData,
      };
      // Create a new homeScreenLayout object to force a rerender
      setHomeScreenLayout(newHomeScreenLayout);
      // Close the current modal
      navigation.goBack();
    }
  };
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [showTitleBar]);

  return (
    <ItemListContext.Provider value={{ itemList, setItemList, toggleItem }}>
      <View style={styles.container}>
        <View style={headerStyle}>
          <View style={styles.topRow}>
            <Pressable onPress={handleCancelButton}>
              <View style={buttonContainerStyle}>
                <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
                  {t("Home.QuickActionsReorderCard.cancel")}
                </Typography.Text>
              </View>
            </Pressable>
            <Typography.Text color="neutralBase-50" weight="regular" size="footnote">
              {t("Home.QuickActionsReorderCard.editActions")}
            </Typography.Text>
            <Pressable onPress={handleSaveButton} disabled={!saveEnabled}>
              <View style={buttonContainerStyle}>
                <Typography.Text
                  color={saveEnabled ? "neutralBase-50" : "neutralBase-50-50%"}
                  size="caption1"
                  weight="semiBold">
                  {t("Home.QuickActionsReorderCard.save")}
                </Typography.Text>
              </View>
            </Pressable>
          </View>
          <View>
            {showTitleBar && (
              <Typography.Text style={styles.subHeader} color="neutralBase-50" align="center">
                {t("Home.QuickActionsReorderCard.selectThreeFavourites")}
              </Typography.Text>
            )}
          </View>
        </View>
        <Reorderer
          topSectionTitle="ACTIVE"
          bottomSectionTitle="NEW ACTIONS"
          maxActiveSections={maxActiveSections}
          minActiveSections={minActiveSections}
          setShowTitleBar={setShowTitleBar}
        />
      </View>
    </ItemListContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  subHeader: {
    marginTop: 10,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

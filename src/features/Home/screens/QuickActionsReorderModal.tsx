import { useEffect, useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";

import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import Reorderer from "@/features/Home/components/Reorderer";
import { quickActionOrderData, quickActionReorderItem } from "@/mocks/quickActionOrderData";
import useNavigation from "@/navigation/use-navigation";
import { palette } from "@/theme/values";

import { ItemListContext } from "../context/ItemListContext";

export default function QuickActionsReorderCard() {
  const minActiveSections = 3;
  const maxActiveSections = 3;
  const [showTitleBar, setShowTitleBar] = useState<boolean>(true);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const navigation = useNavigation(); // Provide the useState to the context via a Context Provider.
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
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Pressable onPress={handleCancelButton}>
              <View style={[styles.buttonContainer]}>
                <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
                  CANCEL
                </Typography.Text>
              </View>
            </Pressable>
            <Typography.Text color="neutralBase-50" weight="regular" size="footnote">
              Edit Actions
            </Typography.Text>
            <Pressable onPress={handleSaveButton} disabled={!saveEnabled}>
              <View style={[styles.buttonContainer]}>
                <Typography.Text
                  opacity={saveEnabled ? "opaque" : "semiTransparent"}
                  color={saveEnabled ? "neutralBase-50" : "neutralBase-30"}
                  size="caption1"
                  weight="semiBold">
                  SAVE
                </Typography.Text>
              </View>
            </Pressable>
          </View>
          <View>
            {showTitleBar && (
              <Typography.Text style={styles.subHeader} color="neutralBase-50">
                Select 3 of your favorite actions to always be accessible on Home.
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
  buttonContainer: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50-12%"],
    borderColor: palette["neutralBase-50-12%"],
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    color: palette["neutralBase-50"],
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  header: {
    backgroundColor: palette.tintBase,
    flexDirection: "column",
    padding: 20,
    paddingTop: 10,
    width: "100%",
  },
  subHeader: { marginTop: 10, textAlign: "center" },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

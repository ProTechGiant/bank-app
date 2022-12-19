import Reorderer from "@/components/Reorderer";
import Typography from "@/components/Typography";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { ItemListContext } from "@/contexts/ItemListContext";
import { homepageOrderData, ReorderItem } from "@/mocks/quickActionOrderData";
import useNavigation from "@/navigation/use-navigation";
import { palette } from "@/theme/values";
import { useEffect, useState } from "react";
import { LayoutAnimation, Pressable, StyleSheet, View } from "react-native";

export default function HomepageReorderModal() {
  const minActiveSections = 0;
  const maxActiveSections = 4;
  const navigation = useNavigation(); // Provide the useState to the context via a Context Provider.
  const [showTitleBar, setShowTitleBar] = useState<boolean>(true);
  const { homeScreenLayout, setHomeScreenLayout } = useGlobalContext();
  let itemList: ReorderItem[], setItemList: React.Dispatch<React.SetStateAction<ReorderItem[]>>;
  // Seed with either current or mock data
  if (homeScreenLayout.homepageOrderData) {
    [itemList, setItemList] = useState(homeScreenLayout.homepageOrderData);
  } else {
    [itemList, setItemList] = useState(homepageOrderData);
  }
  const [saveEnabled, setSaveEnabled] = useState(true);
  const toggleItem = (key: string) => {
    let updatedItemList: ReorderItem[];
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
    // Update the homepageOrderData part of the homeScreenLayout
    if (setHomeScreenLayout && saveEnabled) {
      const newHomeScreenLayout = {
        quickActionOrderData: homeScreenLayout.quickActionOrderData,
        homepageOrderData: itemList,
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
                  color={saveEnabled ? "neutralBase-50" : "neutralBase-30"}
                  opacity={saveEnabled ? "opaque" : "semiTransparent"}
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
                Select your favorite sections to always be accessible on Home.
              </Typography.Text>
            )}
          </View>
        </View>
        <Reorderer
          topSectionTitle="ACTIVE"
          bottomSectionTitle="NEW SECTIONS"
          maxActiveSections={maxActiveSections}
          minActiveSections={minActiveSections}
          requiredList={["quickactions"]}
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
  subHeader: { marginTop: 10, textAlign: "center" },
  header: {
    backgroundColor: palette.tintBase,
    flexDirection: "column",
    padding: 20,
    paddingTop: 10,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette["neutralBase-50-12%"],
    paddingVertical: 9,
    paddingHorizontal: 12,
    color: palette["neutralBase-50"],
    backgroundColor: palette["neutralBase-50-12%"],
  },
});

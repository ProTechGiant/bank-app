import Button from "@/components/Button";
import Reorderer from "@/components/Reorderer";
import Typography from "@/components/Typography";
import { ItemListContext } from "@/contexts/ItemListContext";
import { quickActionOrderData, ReorderItem } from "@/mocks/quickActionOrderData";
import { palette } from "@/theme/values";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function QuickActionsReorderCard() {
  // Provide the useState to the context via a Context Provider.
  const [itemList, setItemList] = useState(quickActionOrderData);

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

  return (
    <ItemListContext.Provider value={{ itemList, setItemList, toggleItem }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View>
              <Button variant="primary" color="alt">
                Cancel
              </Button>
            </View>
            <Typography.Text color="neutralBase-50" weight="regular" size="footnote">
              Edit Actions
            </Typography.Text>
            <View>
              <Button variant="primary" color="alt">
                Save
              </Button>
            </View>
          </View>
          <View>
            <Typography.Text style={styles.subHeader} color="neutralBase-50">
              Select 3 of your favorite actions to always be accessible on Home.
            </Typography.Text>
          </View>
        </View>
        <Reorderer
          topSectionTitle="ACTIVE"
          bottomSectionTitle="NEW ACTIONS"
          maxActiveSections={3}
          minActiveSections={3}
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
});

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { palette } from "@/theme/values";
import SectionHeader from "../SectionHeader";
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from "react-native-draggable-flatlist";
import { ReorderItem } from "@/mocks/quickActionOrderData";
import ReordererItem, { RenderMinimumNotReachedPlaceholders } from "../ReordererItem";
import { useItemListContext } from "@/contexts/ItemListContext";
import { ScrollView } from "react-native-virtualized-view";

interface ReordererProps {
  topSectionTitle: string;
  bottomSectionTitle: string;
  maxActiveSections?: number;
  minActiveSections?: number;
}

function ReordererInactiveObjects(data: ReorderItem[]) {
  // Only render inactive objects
  return data.map(item => {
    if (!item.active) {
      return (
        <ReordererItem
          label={item.label}
          description={item.description}
          isActive={item.active}
          isReorderAllowed={false}
          id={item.key}
          key={item.key}
        />
      );
    }
  });
}

export default function reorderer({
  topSectionTitle,
  bottomSectionTitle,
  maxActiveSections,
  minActiveSections,
}: ReordererProps) {
  const { itemList, setItemList } = useItemListContext();
  const activeItems = itemList.filter((item: ReorderItem) => item.active).length;
  const activeItemsCounter = `${activeItems}/${maxActiveSections}`;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ReorderItem>) => {
    if (item.active) {
      return (
        <ScaleDecorator>
          <TouchableOpacity activeOpacity={1} onLongPress={drag} delayLongPress={0} disabled={isActive}>
            <ReordererItem
              label={item.label}
              description={item.description}
              isActive={item.active}
              isReorderAllowed={true}
              id={item.key}
              key={item.key}
            />
          </TouchableOpacity>
        </ScaleDecorator>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SectionHeader title={topSectionTitle} subTitle={{ text: activeItemsCounter }} />
      {/* Active reorderable items */}
      <DraggableFlatList
        data={itemList}
        onDragEnd={({ data }) => {
          if (setItemList) {
            setItemList(data);
          }
        }}
        keyExtractor={item => item.key}
        renderItem={renderItem}
      />
      {/* Optional Placeholders */}
      <RenderMinimumNotReachedPlaceholders minActiveSections={minActiveSections} activeItems={activeItems} />
      <SectionHeader title={bottomSectionTitle} />
      {/* Inactive items */}
      {ReordererInactiveObjects(itemList)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-40"],
    flex: 1,
    width: "100%",
  },
});

import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { ScrollView } from "react-native-virtualized-view";

import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import { palette } from "@/theme/values";

import { useItemListContext } from "../../context/ItemListContext";
import SectionHeader from "../SectionHeader";
import ReordererItem, { RenderMinimumNotReachedPlaceholders } from "./ReordererItem";

interface ReordererProps {
  topSectionTitle: string;
  bottomSectionTitle: string;
  maxActiveSections?: number;
  minActiveSections?: number;
  requiredList?: string[];
  setShowTitleBar: Dispatch<SetStateAction<boolean>>;
}

function ReordererInactiveObjects(data: ReorderItem[], isAddAllowed: boolean) {
  // Only render inactive objects
  return data.map(item => {
    if (!item.active) {
      return (
        <ReordererItem
          label={item.label}
          description={item.description}
          isActive={item.active}
          isReorderAllowed={false}
          isAddAllowed={isAddAllowed}
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
  requiredList,
  setShowTitleBar,
}: ReordererProps) {
  const { itemList, setItemList } = useItemListContext();
  const activeItems = itemList.filter((item: ReorderItem) => item.active).length;
  let activeItemsCounter;
  if (maxActiveSections && maxActiveSections != Number.MAX_SAFE_INTEGER) {
    activeItemsCounter = `${activeItems}/${maxActiveSections}`;
  } else {
    activeItemsCounter = ``;
  }
  const isAddAllowed = !maxActiveSections || activeItems < maxActiveSections;
  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    if (setShowTitleBar) {
      if (event.nativeEvent.contentOffset.y < 64) {
        setShowTitleBar(true);
      } else {
        setShowTitleBar(false);
      }
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ReorderItem | quickActionReorderItem>) => {
    if (item.active) {
      return (
        <ScaleDecorator>
          <TouchableOpacity activeOpacity={1} onLongPress={drag} delayLongPress={0} disabled={isActive}>
            <ReordererItem
              label={item.label}
              description={item.description}
              isActive={item.active}
              isReorderAllowed={true}
              // Don't allow removal if this Item is on the required lit
              isRemoveAllowed={!requiredList?.includes(item.key)}
              id={item.key}
              key={item.key}
            />
          </TouchableOpacity>
        </ScaleDecorator>
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={20}
      scrollEnabled={handleScroll}
      showsVerticalScrollIndicator={false}>
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
      {ReordererInactiveObjects(itemList, isAddAllowed)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette["neutralBase-40"],
    flex: 1,
    paddingBottom: 20,
    width: "100%",
  },
});

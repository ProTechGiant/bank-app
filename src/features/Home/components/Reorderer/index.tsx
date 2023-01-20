import { Dispatch, SetStateAction } from "react";
import { FlatList, TouchableOpacity, ViewStyle } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";

import SectionHeader from "@/components/SectionHeader";
import { quickActionReorderItem, ReorderItem } from "@/mocks/quickActionOrderData";
import { useThemeStyles } from "@/theme";

import { useItemListContext } from "../../context/ItemListContext";
import ReordererItem, { RenderMinimumNotReachedPlaceholders } from "./ReordererItem";

interface ReordererProps {
  topSectionTitle: string;
  bottomSectionTitle: string;
  maxActiveSections?: number;
  minActiveSections?: number;
  requiredList?: string[];
  setShowTitleBar: Dispatch<SetStateAction<boolean>>;
}

export default function reorderer({
  topSectionTitle,
  bottomSectionTitle,
  maxActiveSections,
  minActiveSections,
  requiredList,
  setShowTitleBar,
}: ReordererProps) {
  const container = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: theme.palette["neutralBase-40"],
      flex: 1,
      paddingBottom: 20,
      width: "100%",
    }),
    []
  );

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

  function ReordererInactiveObjects({ item }: { item: ReorderItem }) {
    // Only render inactive objects
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
    return null;
  }

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
    <FlatList
      style={container}
      onScroll={handleScroll}
      scrollEventThrottle={20}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      // {/* Inactive items */}
      data={itemList}
      renderItem={ReordererInactiveObjects}
      ListHeaderComponent={
        <>
          {/* Active reorderable items */}
          <SectionHeader title={topSectionTitle} subTitle={{ text: activeItemsCounter }} />
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
        </>
      }
    />
  );
}

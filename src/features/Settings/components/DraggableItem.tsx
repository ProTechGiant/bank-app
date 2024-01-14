import React from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DraggableItemProps } from "../types";
import ReOrderSection from "./ReOrderSection";

export default function DraggableItem({ data, onDragEnd }: DraggableItemProps) {
  const handleItemPress = (widgetType: string) => {
    const updatedData = data.map(item => {
      if (item.Name === widgetType) {
        return {
          ...item,
          CustomerConfiguration: { ...item.CustomerConfiguration, IsVisible: !item.CustomerConfiguration.IsVisible },
        };
      }
      return item;
    });

    onDragEnd(updatedData);
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        data={data}
        keyExtractor={item => item.Name}
        renderItem={({ item, drag, isActive }) => (
          <ReOrderSection item={item} onPress={drag} isActive={isActive} handleItemPress={handleItemPress} />
        )}
        onDragEnd={({ data: updatedSections }) => {
          updatedSections = updatedSections.map((section, index) => ({
            ...section,
            CustomerConfiguration: {
              ...section.CustomerConfiguration,
              SectionIndex: index,
            },
          }));
          onDragEnd(updatedSections);
        }}
      />
    </GestureHandlerRootView>
  );
}

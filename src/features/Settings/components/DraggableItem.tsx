import React from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DraggableItemProps } from "../types";
import ReOrderSection from "./ReOrderSection";

export default function DraggableItem({ data, onDragEnd }: DraggableItemProps) {
  const handleItemPress = (name: string) => {
    const updatedData = data.map(item => {
      if (item.name === name) {
        return { ...item, isItemChecked: !item.isItemChecked };
      }
      return item;
    });

    onDragEnd(updatedData);
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        data={data}
        keyExtractor={item => item.type}
        renderItem={({ item, drag, isActive }) => (
          <ReOrderSection item={item} onPress={drag} isActive={isActive} handleItemPress={handleItemPress} />
        )}
        onDragEnd={({ data }) => onDragEnd(data)}
      />
    </GestureHandlerRootView>
  );
}

import React, { useState } from "react";
import { FlatList, Pressable, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { CheckboxInput } from "@/components/Input";
import useThemeStyles from "@/theme/use-theme-styles";

import { mockTransactionType } from "../mocks";
import { TransactionType } from "../types";

interface TransactionTypesProps {
  selectedTransactionTypes: string[];
  setSelectedTransactionTypes: (selectedTransactionTypes: string[]) => void;
}

export default function TransactionTypes({
  selectedTransactionTypes,
  setSelectedTransactionTypes,
}: TransactionTypesProps) {
  const transactionTypesData: TransactionType[] = mockTransactionType.map((item, index) => ({
    id: index,
    label: item,
    checked: selectedTransactionTypes.includes(item),
  }));
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(transactionTypesData);

  const handleCheckboxChange = (itemId: number) => {
    const updatedItems: TransactionType[] = transactionTypes.map(item => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setTransactionTypes(updatedItems);
    const selectedLabelsArray = updatedItems.filter(item => item.checked).map(item => item.label);
    setSelectedTransactionTypes(selectedLabelsArray);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    marginLeft: theme.spacing["16p"],
  }));

  const flatListStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["20p"],
  }));

  const renderItem = ({ item }: { item: TransactionType }) => (
    <Pressable onPress={() => handleCheckboxChange(item.id)}>
      <Stack direction="horizontal" justify="space-between" style={containerStyle} align="center">
        <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
          {item.label}
        </Typography.Text>
        <CheckboxInput value={item.checked} onChange={() => handleCheckboxChange(item.id)} />
      </Stack>
    </Pressable>
  );

  return (
    <FlatList
      data={transactionTypes}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      style={flatListStyle}
    />
  );
}

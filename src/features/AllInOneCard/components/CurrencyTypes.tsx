import React, { useState } from "react";
import { FlatList, Pressable, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { CheckboxInput } from "@/components/Input";
import useThemeStyles from "@/theme/use-theme-styles";

import { mockCurrencyType } from "../mocks";
import { CurrencyType } from "../types";

interface CurrencyTypesProps {
  selectedCurrencies: string[];
  setSelectedCurrencies: (selectedCurrencies: string[]) => void;
}
export default function CurrencyTypes({ selectedCurrencies, setSelectedCurrencies }: CurrencyTypesProps) {
  const CurrencyTypesData: CurrencyType[] = mockCurrencyType.map((item, index) => ({
    id: index,
    currencyData: item,
    checked: selectedCurrencies.includes(item.value),
  }));
  const [items, setItems] = useState<CurrencyType[]>(CurrencyTypesData);

  const handleCheckboxChange = (itemId: number) => {
    const updatedItems: CurrencyType[] = items.map(item => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    setItems(updatedItems);
    const selectedCurrenciesArray: string[] = updatedItems
      .filter(item => item.checked)
      .map(item => item.currencyData.value);
    setSelectedCurrencies(selectedCurrenciesArray);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const flatListContainer = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const renderItem = ({ item }: { item: CurrencyType }) => (
    <Pressable onPress={() => handleCheckboxChange(item.id)} style={containerStyle}>
      <Stack direction="horizontal" justify="space-between" align="center">
        <Stack direction="horizontal" gap="16p" align="flex-start">
          {item.currencyData.icon}
          <View>
            <Typography.Text color="neutralBase+30" weight="medium" size="callout">
              {item.currencyData.currency}
            </Typography.Text>
            <Typography.Text color="neutralBase" weight="medium" size="footnote">
              {item.currencyData.country}
            </Typography.Text>
          </View>
        </Stack>

        <CheckboxInput value={item.checked} onChange={() => handleCheckboxChange(item.id)} />
      </Stack>
    </Pressable>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      style={flatListContainer}
    />
  );
}

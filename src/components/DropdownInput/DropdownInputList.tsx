import { useCallback, useMemo } from "react";
import { FlatList, Platform, Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { CheckmarkCircle } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DropdownInputListProps<T extends string | number> {
  options: Array<{ label: string; value: T; disabled?: boolean }>;
  onChange: (value: T) => void;
  value: T | undefined;
}

export function DropdownInputList<T extends string | number>({ options, onChange, value }: DropdownInputListProps<T>) {
  const { height } = useWindowDimensions();

  const flatlistStyle = useMemo(
    () => ({
      height: height - (Platform.OS === "ios" ? 254 : 204),
    }),
    [height]
  );

  const optionContainer = useThemeStyles<ViewStyle>(({ spacing, palette }) => ({
    paddingVertical: spacing["24p"],
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: palette["neutralBase-20"],
  }));

  const checkBoxStyles = useThemeStyles<ViewStyle>(({ palette }) => ({
    borderColor: palette["neutralBase-20"],
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  }));

  const renderItem = useCallback(
    ({ item }: { item: { label: string; value: T; disabled?: boolean } }) => (
      <Pressable
        onPress={() => onChange(item.value)}
        disabled={item.disabled}
        style={[optionContainer, item.disabled && styles.disabledOpacity]}>
        <View style={styles.textContainer}>
          <Typography.Text color="neutralBase+30" size="body" weight="regular">
            {item.label}
          </Typography.Text>
        </View>
        <View style={checkBoxStyles}>{(value === item.value || item.disabled === true) && <CheckmarkCircle />}</View>
        <View />
      </Pressable>
    ),
    [value]
  );

  return (
    <FlatList
      style={flatlistStyle}
      data={options}
      keyExtractor={option => option.value.toString()}
      renderItem={renderItem}
      removeClippedSubviews
      getItemLayout={(_data, index) => ({ length: 73, offset: 73 * index, index })}
    />
  );
}

const styles = StyleSheet.create({
  disabledOpacity: {
    opacity: 0.4,
  },
  textContainer: {
    flex: 1,
  },
});

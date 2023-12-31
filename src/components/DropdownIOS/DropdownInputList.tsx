import { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DropdownInputListProps<T extends string | number> {
  options: { icon?: React.ReactElement<SvgProps | IconProps>; label: string; value: T; disabled?: boolean }[];
  onChange: (value: T) => void;
  value: T | undefined;
  testID?: string;
}

export function DropdownInputList<T extends string | number>({
  options,
  onChange,
  value,
  testID,
}: DropdownInputListProps<T>) {
  const { height } = useWindowDimensions();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    columnGap: theme.spacing["12p"],
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["4p"],
  }));

  const renderItem: ListRenderItem<(typeof options)[number]> = useCallback(
    ({ item }) => (
      <Pressable
        disabled={item.disabled}
        onPress={() => onChange(item.value)}
        testID={testID !== undefined ? `${testID}-${item.value}` : undefined}>
        <View style={[containerStyle, item.disabled && styles.itemDisabled]}>
          {item.icon}
          <Typography.Text color="neutralBase+30" size="callout" weight="regular" style={styles.text}>
            {item.label}
          </Typography.Text>
          <Radio onPress={() => onChange(item.value)} disabled={item.disabled} isSelected={value === item.value} />
        </View>
      </Pressable>
    ),
    [containerStyle, onChange, value]
  );

  return (
    <FlatList
      style={{
        height: height - (Platform.OS === "ios" ? MODAL_CONTAINER_HEIGHT_IOS : MODAL_CONTAINER_HEIGHT_ANDROID),
      }}
      data={options}
      keyExtractor={option => option.value.toString()}
      renderItem={renderItem}
      getItemLayout={(_data, index) => ({ length: 68, offset: 68 * index, index })}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  itemDisabled: {
    opacity: 0.4,
  },
  text: {
    flexGrow: 1,
    width: 100,
  },
});

const MODAL_CONTAINER_HEIGHT_ANDROID = 204;
const MODAL_CONTAINER_HEIGHT_IOS = 254;

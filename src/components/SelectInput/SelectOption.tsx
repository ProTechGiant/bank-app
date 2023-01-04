import { Pressable, StyleSheet, View } from "react-native";

import { TickIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { palette, spacing } from "@/theme/values";

import { Option } from ".";

interface SelectOptionProps {
  item: Option;
  index: number;
  onSelect: (value: string) => void;
  selected: string;
}

const SelectOption = ({ item, index, onSelect, selected }: SelectOptionProps) => {
  const selectionHandler = () => {
    onSelect(item.value);
  };

  return (
    <Pressable onPress={selectionHandler}>
      <View style={[styles.selectItem, index > 0 && styles.selectItemSeparator]}>
        <Typography.Text
          weight={selected === item.value ? "medium" : "regular"}
          color={selected === item.value ? "neutralBase+20" : "neutralBase"}>
          {item.label}
        </Typography.Text>
        {selected === item.value && (
          <View style={styles.tickIcon}>
            <TickIcon />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default SelectOption;

const styles = StyleSheet.create({
  selectItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 0,
    paddingVertical: spacing.medium,
  },
  selectItemSeparator: {
    borderColor: palette["neutralBase-20"],
    borderTopWidth: 1,
  },
  tickIcon: {
    paddingRight: spacing.large,
  },
});

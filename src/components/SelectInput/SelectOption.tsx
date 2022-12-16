import { Icons } from "@/assets/icons";
import { spacing, palette } from "@/theme/values";
import { Pressable, StyleSheet, View } from "react-native";
import { Option } from ".";
import Typography from "../Typography";

interface SelectOptionProps {
  item: Option;
  index: number;
  onSelect: (value: string) => void;
  selected: string;
}

const SelectOption = ({ item, index, onSelect, selected }: SelectOptionProps) => {
  const Tick = Icons.Tick;

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
            <Tick />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default SelectOption;

const styles = StyleSheet.create({
  selectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 0,
    paddingVertical: spacing.medium,
  },
  selectItemSeparator: {
    borderTopWidth: 1,
    borderColor: palette["neutralBase-20"],
  },
  tickIcon: {
    paddingRight: spacing.large,
  },
});

import { Pressable, View, ViewStyle } from "react-native";

import { TickIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { Option } from ".";

interface SelectOptionProps {
  item: Option;
  index: number;
  onSelect: (value: string) => void;
  selected: string;
}

const SelectOption = ({ item, index, onSelect, selected }: SelectOptionProps) => {
  const selectItemStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 0,
      paddingVertical: theme.spacing.medium,
    }),
    []
  );
  const selectItemSeparatorStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette["neutralBase-20"],
      borderTopWidth: 1,
    }),
    []
  );
  const tickIconStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingRight: spacing.large,
    }),
    []
  );

  const selectionHandler = () => {
    onSelect(item.value);
  };

  return (
    <Pressable onPress={selectionHandler}>
      <View style={[selectItemStyle, index > 0 && selectItemSeparatorStyle]}>
        <Typography.Text
          weight={selected === item.value ? "medium" : "regular"}
          color={selected === item.value ? "neutralBase+20" : "neutralBase"}>
          {item.label}
        </Typography.Text>
        {selected === item.value && (
          <View style={tickIconStyle}>
            <TickIcon />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default SelectOption;

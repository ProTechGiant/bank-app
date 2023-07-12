import { FlatList, Pressable, View, ViewStyle } from "react-native";

import { CheckIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CompareDurationTypes } from "../enum";
const listData: CompareDurationTypes[] = [
  CompareDurationTypes.DAY,
  CompareDurationTypes.WEEK,
  CompareDurationTypes.MONTH,
  CompareDurationTypes.YEAR,
];

interface CompareByListProps {
  activeFilter: string;
  onChange: (value: CompareDurationTypes) => void;
}
interface RenderListItemProps extends CompareByListProps {
  item: CompareDurationTypes;
}

export default function CompareByList({ onChange, activeFilter }: CompareByListProps) {
  return (
    <View>
      <FlatList
        data={listData}
        renderItem={({ item }) => <RenderListItem onChange={onChange} activeFilter={activeFilter} item={item} />}
      />
    </View>
  );
}
const RenderListItem = ({ onChange, item, activeFilter }: RenderListItemProps) => {
  const listContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: theme.spacing["12p"],
  }));

  const chevronColor = useThemeStyles(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={() => onChange(item)} style={listContainerStyle}>
      <Typography.Text
        weight="regular"
        size="callout"
        color={activeFilter === item ? "primaryBase-40" : "neutralBase+30"}>
        {item}
      </Typography.Text>
      {activeFilter === item && <CheckIcon color={chevronColor} />}
    </Pressable>
  );
};

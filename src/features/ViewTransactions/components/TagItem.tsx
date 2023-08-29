import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import MarkedSVG from "../assets/images/marked.svg";
import UnMarkedSVG from "../assets/images/unmarked.svg";
import { GenericSvgIcon, SwipeToDelete } from "../components";
import { PredefinedTagType } from "../types";

interface TagItemProps {
  item: PredefinedTagType;
  isSelected: boolean;
  isSelectable: boolean;
  onPress?: () => void;
  onDeletePress?: () => void;
}

export default function TagItem({ item, isSelected, isSelectable, onPress, onDeletePress }: TagItemProps) {
  const tagRowFirtItemStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["12p"],
  }));

  const tagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderRadius: theme.radii.xlarge,
    justifyItems: "center",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  const { selectedTag, unselectedTag, arrowColor } = useThemeStyles(theme => ({
    selectedTag: theme.palette["secondary_blueBase-20"],
    unselectedTag: theme.palette["neutralBase-20"],
    arrowColor: theme.palette["neutralBase-30"],
  }));

  const tagItem = () => (
    <Pressable style={styles.tagRowStyle} key={item.id} onPress={onPress}>
      <View style={tagRowFirtItemStyle}>
        <View style={tagIconContainerStyle}>
          <GenericSvgIcon path={item.path} viewBox={item.viewBox} color={isSelected ? selectedTag : unselectedTag} />
        </View>
        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
          {item.name}
        </Typography.Text>
      </View>
      <View>
        {isSelectable ? isSelected ? <MarkedSVG /> : <UnMarkedSVG /> : <ChevronRightIcon color={arrowColor} />}
      </View>
    </Pressable>
  );

  return onDeletePress === undefined ? (
    tagItem()
  ) : (
    <SwipeToDelete handleOnDeletePress={onDeletePress}>{tagItem()}</SwipeToDelete>
  );
}

const styles = StyleSheet.create({
  tagRowStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

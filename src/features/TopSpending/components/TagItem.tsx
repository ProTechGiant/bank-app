import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

import MarkedSVG from "../assets/marked.svg";
import { GenericSvgIcon, SwipeToDelete } from "../components";
import { PredefinedTagType } from "../types";
// import UnMarkedSVG from "../assets/unmarked.svg";

interface TagItemProps {
  item: PredefinedTagType;
  isTag: boolean;
  onPress?: () => void;
  onDeletePress?: () => void;
}

export default function TagItem({ item, isTag, onPress, onDeletePress }: TagItemProps) {
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

  const tagItem = () => (
    <Pressable style={styles.tagRowStyle} key={item.id} onPress={onPress}>
      <View style={tagRowFirtItemStyle}>
        <View style={tagIconContainerStyle}>
          <GenericSvgIcon path={item.path} viewBox={item.viewBox} />
        </View>
        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
          {item.name}
        </Typography.Text>
      </View>
      <View>{isTag ? <MarkedSVG /> : <ChevronRightIcon color={palette["neutralBase-30"]} />}</View>
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

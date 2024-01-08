import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Path, Svg } from "react-native-svg";

import { ChevronRightIcon } from "@/assets/icons";
import { CheckboxInput } from "@/components/Input";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { GenericSvgIcon, SwipeToDelete } from "../components";
import { PredefinedTagType } from "../types";

interface TagItemProps {
  isCustomTag?: boolean;
  isCreateTag?: boolean;
  item: PredefinedTagType;
  isSelected: boolean;
  isSelectable: boolean;
  onPress?: () => void;
  onDeletePress?: () => void;
  testID?: string;
  tagBackgroundColor?: string;
}

export default function TagItem({
  isCreateTag,
  isCustomTag,
  item,
  isSelected,
  isSelectable,
  onPress,
  onDeletePress,
  testID,
  tagBackgroundColor = "#F1F1F4",
}: TagItemProps) {
  const tagRowFirtItemStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["12p"],
  }));

  const tagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    justifyItems: "center",
    alignItems: "center",
  }));

  const createTagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    justifyItems: "center",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
  }));

  const customTagIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    justifyItems: "center",
    alignItems: "center",
  }));

  const arrowColor = useThemeStyles(theme => theme.palette["neutralBase-30"]);

  const customTagColor = useThemeStyles(theme => theme.palette.complimentBase);

  const tagIconColor = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const tagItem = () => (
    <Pressable style={styles.tagRowStyle} key={item.id} onPress={onPress} testID={testID}>
      <View style={tagRowFirtItemStyle}>
        {isCustomTag ? (
          <View style={customTagIconContainerStyle}>
            <GenericSvgIcon path={item.path} viewBox={item.viewBox} color={customTagColor} />
          </View>
        ) : isCreateTag ? (
          <View style={createTagIconContainerStyle}>
            <GenericSvgIcon path={item.path} viewBox={item.viewBox} color={tagIconColor} />
          </View>
        ) : (
          <View style={tagIconContainerStyle}>
            <View style={styles.tagContainerStyle}>
              <Svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
                <Path
                  d="M3.47184 7.22527C4.03367 2.7306 8.21169 -0.401509 12.6836 0.319558L35.0653 3.92849C38.8271 4.53506 41.639 7.71062 41.7858 11.5182L42.6796 34.6917C42.8545 39.2275 39.2247 43 34.6855 43H8.06225C3.25027 43 -0.472818 38.7825 0.124035 34.0077L3.47184 7.22527Z"
                  fill={tagBackgroundColor}
                />
              </Svg>
            </View>
            <GenericSvgIcon path={item.path} viewBox={item.viewBox} color={tagIconColor} />
          </View>
        )}
        <Typography.Text size="callout" weight="regular" color="neutralBase+30">
          {item.name}
        </Typography.Text>
      </View>
      {isSelectable ? <CheckboxInput value={isSelected} /> : <ChevronRightIcon color={arrowColor} />}
    </Pressable>
  );

  return onDeletePress === undefined ? (
    tagItem()
  ) : (
    <SwipeToDelete handleOnDeletePress={onDeletePress}>{tagItem()}</SwipeToDelete>
  );
}

const styles = StyleSheet.create({
  tagContainerStyle: { position: "absolute", zIndex: -1 },
  tagRowStyle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

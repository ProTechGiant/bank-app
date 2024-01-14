import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";

import { HamburgerIcon, MinusIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { HomepageItemLayoutType } from "@/types/Homepage";

interface ActiveReordererItemProps {
  onDeletePress?: () => void;
  onPress: () => void;
  isActive: boolean;
  item: HomepageItemLayoutType;
}

export default function ActiveReordererItem({ onDeletePress, onPress, isActive, item }: ActiveReordererItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["12p"],
  }));

  const iconStyle = useThemeStyles<TextStyle>(theme => ({
    marginEnd: theme.spacing["12p"],
  }));

  return (
    <ScaleDecorator>
      <Pressable
        disabled={isActive}
        onPressIn={onPress}
        style={containerStyle}
        testID={`Home.SectionsReordererModal:Option-${item.name}`}>
        {undefined !== onDeletePress ? (
          <Pressable
            onPress={onDeletePress}
            style={iconStyle}
            testID={`Home.SectionsReordererModal:DeleteOption-${item.name}`}>
            <MinusIcon />
          </Pressable>
        ) : null}
        <Typography.Text color="primaryBase" size="callout" weight="medium" style={styles.text}>
          {item.Name}
        </Typography.Text>
        <HamburgerIcon />
      </Pressable>
    </ScaleDecorator>
  );
}

const styles = StyleSheet.create({
  text: {
    flexGrow: 1,
  },
});

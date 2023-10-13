import { Pressable, View, ViewStyle } from "react-native";

import { DisabledPlusCircleIcon, PlusCircleIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { HomepageItemLayoutType } from "../types";

interface InactiveReordererItemProps {
  disabled: boolean;
  onPress: () => void;
  item: HomepageItemLayoutType;
}

export default function InactiveReordererItem({ disabled, onPress, item }: InactiveReordererItemProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderRadius: theme.radii.extraSmall,
    flexDirection: "row",
    paddingVertical: theme.spacing["16p"],
    paddingStart: theme.spacing["12p"],
    paddingEnd: theme.spacing["48p"],
    marginHorizontal: theme.spacing["20p"],
    marginBottom: theme.spacing["12p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flexGrow: 0.5,
    marginHorizontal: theme.spacing["12p"],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={containerStyle}
      testID={`Home.SectionsReordererModal:Option-${item.name}`}>
      {disabled ? <DisabledPlusCircleIcon /> : <PlusCircleIcon />}
      <View style={contentStyle}>
        <Typography.Text color={disabled ? "neutralBase-20" : "primaryBase"} size="callout" weight="medium">
          {item.name}
        </Typography.Text>
        <Typography.Text color={disabled ? "neutralBase-20" : "neutralBase-10"} size="caption1" weight="regular">
          {item.description}
        </Typography.Text>
      </View>
    </Pressable>
  );
}

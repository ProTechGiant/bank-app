import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import DragIcon from "../assets/icons/DragIcon";
import SelectedBoxIcon from "../assets/icons/SelectedBoxIcon";
import UnSelectedBoxIcon from "../assets/icons/UnSelectedBoxIcon";
import { ReOrderSectionProps } from "../types";

export default function ReOrderSection({ item, onPress, handleItemPress }: ReOrderSectionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing["16p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-60"],
    marginVertical: theme.spacing["4p"],
    gap: theme.spacing["12p"],
    width: "100%",
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    flex: 1,
  }));

  return (
    <ScaleDecorator>
      <Stack
        direction="horizontal"
        as={Pressable}
        align="stretch"
        onPress={() => handleItemPress(item.Name)}
        style={containerStyle}>
        <View style={[contentContainerStyle]}>
          <Stack direction="horizontal" as={Pressable} align="stretch" onPressIn={onPress}>
            <DragIcon />
            <View style={contentStyle}>
              <Typography.Text size="callout" weight="regular" color="neutralBase+30">
                {item.Name}
              </Typography.Text>
              <Typography.Text size="footnote" color="neutralBase" weight="regular">
                {item.Description}
              </Typography.Text>
            </View>
          </Stack>
          <View style={styles.checkBoxContainer}>
            {item.CustomerConfiguration.IsVisible ? <SelectedBoxIcon /> : <UnSelectedBoxIcon />}
          </View>
        </View>
      </Stack>
    </ScaleDecorator>
  );
}
const styles = StyleSheet.create({
  checkBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

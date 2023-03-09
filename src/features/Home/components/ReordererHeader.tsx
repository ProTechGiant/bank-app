import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import BackgroundCollapsedSvg from "../background-header-collapsed.svg";

interface ReordererHeaderProps {
  cancelText: string;
  onCancelPress: () => void;
  onSavePress: () => void;
  isSaveable: boolean;
  saveText: string;
  title: string;
}

export default function ReordererHeader({
  cancelText,
  onCancelPress,
  onSavePress,
  isSaveable,
  saveText,
  title,
}: ReordererHeaderProps) {
  const headerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["24p"],
    width: "100%",
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette.errorBase,
    borderRadius: 24,
    justifyContent: "center",
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["8p"],
  }));

  const cancelButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.errorBase,
  }));

  const saveButtonStyle = useThemeStyles<ViewStyle>(
    theme => ({
      backgroundColor: isSaveable ? theme.palette.primaryBase : theme.palette["primaryBase-12%"],
    }),
    [isSaveable]
  );

  return (
    <View>
      <View style={styles.background}>
        <BackgroundCollapsedSvg />
      </View>
      <View style={headerStyle}>
        <Pressable onPress={onCancelPress} style={[buttonContainerStyle, cancelButtonStyle]}>
          <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
            {cancelText}
          </Typography.Text>
        </Pressable>
        <Typography.Text color="primaryBase" weight="regular" size="body">
          {title}
        </Typography.Text>
        <Pressable disabled={!isSaveable} onPress={onSavePress} style={[buttonContainerStyle, saveButtonStyle]}>
          <Typography.Text color="neutralBase-50" size="caption1" weight="semiBold">
            {saveText}
          </Typography.Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 75,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

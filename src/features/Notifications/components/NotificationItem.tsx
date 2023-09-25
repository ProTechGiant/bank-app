import { cloneElement, useState } from "react";
import { ImageStyle, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SUBTITLE_MAX_LENGTH } from "../types";

interface NotificationItemProps {
  title: string;
  subtitle: string;
  time: string;
  icon: React.ReactElement<IconProps>;
  onPress: () => void;
}
export default function NotificationItem({ title, subtitle, time, icon, onPress }: NotificationItemProps) {
  const [subtitleText, setSubtitleText] = useState<string>(
    subtitle.length > SUBTITLE_MAX_LENGTH ? `${subtitle.slice(0, SUBTITLE_MAX_LENGTH - 3)}...` : subtitle
  );

  const handleOnPress = () => {
    if (subtitle !== subtitleText) setSubtitleText(subtitle);
    else onPress();
  };

  const itemStackStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    justifyContent: "space-between",
    padding: theme.spacing["12p"],
    marginBottom: theme.spacing["12p"],
  }));

  const iconStyle = useThemeStyles<ImageStyle>(theme => ({
    margin: theme.spacing["8p"],
  }));

  const iconProps = useThemeStyles(theme => ({
    color: theme.palette.complimentBase,
    width: theme.spacing["20p"],
    height: theme.spacing["20p"],
  }));

  return (
    <Pressable onPress={handleOnPress}>
      <Stack direction="horizontal" style={itemStackStyle} gap="8p">
        <View style={iconStyle}>{cloneElement(icon, { ...iconProps })}</View>
        <Stack direction="vertical" style={styles.textStyles} gap="4p">
          <Typography.Text align="left">{title}</Typography.Text>
          <Typography.Text align="left" size="caption2">
            {subtitleText}
          </Typography.Text>
          <Typography.Text align="left" size="caption1">
            {time}
          </Typography.Text>
        </Stack>
      </Stack>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  textStyles: {
    flexGrow: 1,
    width: "50%",
  },
});

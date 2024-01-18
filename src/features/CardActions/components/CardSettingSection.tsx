import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SectionProps {
  title: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress?: () => void;
}

export default function CardSettingsSection({ title, icon, onPress }: SectionProps) {
  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const settingStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));
  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="12p" align="center" style={settingStyle}>
        {icon}
        <Stack direction="vertical" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {title}
          </Typography.Text>
        </Stack>
        <View style={[styles.chevronContainer]}>
          <ChevronRightIcon color={rightIconColor} />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

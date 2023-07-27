import { Pressable, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LanguageOptionProps {
  title: string;
  currentLanguage: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress?: () => void;
}

export default function LanguageOption({ title, currentLanguage, icon, onPress }: LanguageOptionProps) {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    flex: 1,
  }));

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <Stack direction="vertical" gap="32p" justify="space-between" align="stretch">
        <Stack direction="horizontal" gap="16p" justify="space-between" align="center">
          {icon}
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {currentLanguage}
          </Typography.Text>
        </Stack>
        <Typography.Text size="callout" weight="medium">
          {title}
        </Typography.Text>
      </Stack>
    </Pressable>
  );
}

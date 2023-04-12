import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface CategorySectionProps {
  title: string;
  content: string;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress: () => void;
}

export default function CategorySection({ title, content, icon, onPress }: CategorySectionProps) {
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" gap="16p">
        {icon}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {title}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {content}
          </Typography.Text>
        </Stack>
        <View style={styles.chevronStyle}>
          <ChevronRightIcon color={iconColor} />
        </View>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevronStyle: {
    alignSelf: "center",
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
});

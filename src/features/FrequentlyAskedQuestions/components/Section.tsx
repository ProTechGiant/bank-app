import { cloneElement } from "react";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { ChevronRightIcon, IconProps } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FAQData } from "../types";

interface SectionProps {
  data: FAQData;
  icon: React.ReactElement<SvgProps | IconProps>;
  onPress: (data: FAQData, title: string) => void;
}

export default function Section({ data, icon, onPress }: SectionProps) {
  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const leftIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Pressable onPress={() => onPress(data, data.CategoryName)}>
      <Stack direction="horizontal" gap="20p">
        {cloneElement(icon, {
          color: leftIconColor,
        })}
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="callout" weight="medium">
            {data.CategoryName}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {data.CategoryDescription}
          </Typography.Text>
        </Stack>
        <View style={styles.chevronContainer}>
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

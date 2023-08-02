import { I18nManager, Image, Pressable, StyleSheet, View } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FAQData } from "../types";

interface SectionProps {
  data: FAQData;
  onPress: (data: FAQData, title: string) => void;
}

export default function Section({ data, onPress }: SectionProps) {
  const rightIconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  return (
    <Pressable onPress={() => onPress(data, data.CategoryName)}>
      <Stack direction="horizontal" gap="20p">
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.Icon }} style={styles.categortImage} />
        </View>
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
  categortImage: {
    height: "100%",
    width: "100%",
  },
  chevronContainer: {
    alignSelf: "center",
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  imageContainer: {
    height: 24,
    width: 24,
  },
});

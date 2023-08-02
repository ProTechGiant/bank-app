import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FAQData, FAQSection } from "../types";

interface FAQListPreviewProps {
  data: FAQData[];
  onPress: (faqId: string) => void;
}

export default function FAQListPreview({ data, onPress }: FAQListPreviewProps) {
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const sectionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["4p"],
  }));

  const queryContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexShrink: 1,
    marginVertical: theme.spacing["16p"],
  }));

  return (
    <>
      {data.map((item, index) => {
        return (
          <View key={index}>
            <Typography.Text weight="semiBold" size="callout" style={sectionHeaderStyle}>
              {item.CategoryName}
            </Typography.Text>
            {item.Faqs &&
              item.Faqs.map((faq_item: FAQSection) => {
                return (
                  <Pressable
                    style={styles.sectionContentStyle}
                    key={faq_item.FaqId}
                    onPress={() => onPress(faq_item.FaqId)}>
                    <Stack direction="horizontal" gap="20p" align="center" justify="space-between">
                      <View style={queryContainerStyle}>
                        <Typography.Text size="callout">{faq_item.Query}</Typography.Text>
                      </View>
                      <View style={styles.chevronContainer}>
                        <ChevronRightIcon color={iconColor} />
                      </View>
                    </Stack>
                  </Pressable>
                );
              })}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  sectionContentStyle: {
    width: "100%",
  },
});

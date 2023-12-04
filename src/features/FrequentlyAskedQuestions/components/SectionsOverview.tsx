import { I18nManager, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FAQData, FAQSection } from "../types";

interface SectionsOverviewProps {
  data: FAQData;
  onPress: (faqId: string) => void;
}

export default function SectionsOverview({ data, onPress }: SectionsOverviewProps) {
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const sectionHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
    paddingBottom: theme.spacing["4p"],
  }));

  const sectionContentStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    width: "100%",
  }));

  return (
    <ScrollView contentContainerStyle={container} alwaysBounceVertical={false}>
      {data.Sections?.map(Section => {
        return (
          <View key={Section.SectionId}>
            <Typography.Text weight="medium" size="title3" style={sectionHeaderStyle}>
              {Section.SectionName}
            </Typography.Text>
            {Section.SectionFaqs &&
              Section.SectionFaqs.map((section_faq: FAQSection) => {
                return (
                  <Pressable
                    style={sectionContentStyle}
                    key={section_faq.FaqId}
                    onPress={() => onPress(section_faq.FaqId)}>
                    <Stack direction="horizontal" gap="20p" align="center" justify="space-between">
                      <Typography.Text size="callout" color="neutralBase+30">
                        {section_faq.Query}
                      </Typography.Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chevronContainer: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

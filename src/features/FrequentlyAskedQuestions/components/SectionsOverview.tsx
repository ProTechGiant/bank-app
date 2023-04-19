import { title } from "process";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { faqSearchResponse, FAQSection } from "../types";

interface SectionsOverviewProps {
  data: FAQSection[];
  faqSearchResponses?: faqSearchResponse[];
}

export default function SectionsOverview({ data, faqSearchResponses }: SectionsOverviewProps) {
  const navigation = useNavigation();
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

  if (faqSearchResponses !== undefined) {
    // Only keep FAQ's with their respective section if their ID is found in the search response
    data = data.filter(category => {
      return (
        category.section_faqs.filter(sections_faq => {
          return faqSearchResponses.some(faqSearch => {
            return faqSearch.id === sections_faq.faq_id;
          });
        }).length > 0
      );
    });
  }
  return (
    <ScrollView contentContainerStyle={container} alwaysBounceVertical={false}>
      {data.map(category => {
        return (
          <View key={category.section_name}>
            <Typography.Text weight="semiBold" size="callout" style={sectionHeaderStyle}>
              {category.section_name}
            </Typography.Text>
            {category.section_faqs &&
              category.section_faqs.map(section_faq => {
                return (
                  <Pressable
                    style={sectionContentStyle}
                    key={section_faq.faq_id}
                    onPress={() => {
                      navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { data: section_faq, title });
                    }}>
                    <Stack direction="horizontal" gap="20p" align="center" justify="space-between">
                      <Typography.Text size="callout">{section_faq.query}</Typography.Text>
                      <ChevronRightIcon color={iconColor} />
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

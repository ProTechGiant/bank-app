import { RouteProp, useRoute } from "@react-navigation/native";
import { Pressable, ScrollView, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import MainStackParams from "@/navigation/mainStackParams";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

export default function SectionScreen() {
  const route = useRoute<RouteProp<MainStackParams, "FrequentlyAskedQuestions.SectionScreen">>();
  const { data, title } = route.params;
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

  return (
    <Page>
      <NavHeader title={title} />
      <ScrollView contentContainerStyle={container} alwaysBounceVertical={false}>
        {data.map(d => {
          return (
            <View key={d.section_name}>
              <Typography.Text weight="semiBold" size="callout" style={sectionHeaderStyle}>
                {d.section_name}
              </Typography.Text>
              {d.section_faqs &&
                d.section_faqs.map(sectionFAQS => {
                  return (
                    <Pressable
                      style={sectionContentStyle}
                      key={sectionFAQS.faq_id}
                      onPress={() => {
                        navigation.navigate("FrequentlyAskedQuestions.DetailedScreen", { data: sectionFAQS, title });
                      }}>
                      <Stack direction="horizontal" gap="20p" align="center" justify="space-between">
                        <Typography.Text size="callout">{sectionFAQS.query}</Typography.Text>
                        <ChevronRightIcon color={iconColor} />
                      </Stack>
                    </Pressable>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>
    </Page>
  );
}

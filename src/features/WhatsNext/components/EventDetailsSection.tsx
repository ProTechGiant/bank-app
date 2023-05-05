import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { ShareIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import openLink from "@/features/FrequentlyAskedQuestions/utils/open-link";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { EventDetails } from "../types";

interface EventDetailsSectionProps {
  data: EventDetails;
}

export default function EventDetailsSection({ data }: EventDetailsSectionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const websiteWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    gap: theme.spacing["8p"],
    alignItems: "center",
  }));

  const inAppBrowserBackgroundColor = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  const inAppBrowserColor = useThemeStyles<string>(theme => theme.palette["primaryBase-40"]);

  return (
    <Stack gap="24p" direction="vertical">
      <Typography.Text weight="medium" size="title3">
        {t("WhatsNext.ExploreArticleScreen.eventDetails")}
      </Typography.Text>
      <View>
        <Typography.Text color="neutralBase" size="footnote">
          {t("WhatsNext.ExploreArticleScreen.openingHours")}
        </Typography.Text>
        <Typography.Text size="callout">{data.OpeningHours}</Typography.Text>
      </View>
      <View>
        <Typography.Text color="neutralBase" size="footnote">
          {t("WhatsNext.ExploreArticleScreen.address")}
        </Typography.Text>
        <Typography.Text size="callout">{data.Location}</Typography.Text>
      </View>
      <View>
        <Typography.Text color="neutralBase" size="footnote">
          {t("WhatsNext.ExploreArticleScreen.price")}
        </Typography.Text>
        <Typography.Text size="callout">
          {data.Price}
          {" " + t("WhatsNext.ExploreArticleScreen.currency")}
        </Typography.Text>
      </View>
      <Pressable
        style={websiteWrapperStyle}
        onPress={() => {
          openLink(data.Website, inAppBrowserBackgroundColor, inAppBrowserColor, navigation);
        }}>
        <ShareIcon />
        <Typography.Text color="primaryBase-40" size="callout">
          {t("WhatsNext.ExploreArticleScreen.visitWebsite")}
        </Typography.Text>
      </Pressable>
    </Stack>
  );
}

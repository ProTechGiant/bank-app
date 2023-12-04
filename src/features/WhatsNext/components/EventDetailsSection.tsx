import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ChevronRightIcon, ShareIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useOpenLink from "@/hooks/use-open-link";
import { useThemeStyles } from "@/theme";

import HourGlassIcon from "../assets/HourGlassIcon";
import LocationIcon from "../assets/LocationIcon";
import SellIcon from "../assets/SellIcon";
import { EventDetails } from "../types";

interface EventDetailsSectionProps {
  data: EventDetails;
}

export default function EventDetailsSection({ data }: EventDetailsSectionProps) {
  const { t } = useTranslation();
  const openLink = useOpenLink();
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const visitWebsiteColor = useThemeStyles<string>(theme => theme.palette.complimentBase);

  const websiteWrapperStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    gap: theme.spacing["8p"],
    alignItems: "center",
  }));
  const IconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: 10,
    borderRadius: theme.spacing["64p"],
    backgroundColor: theme.palette["neutralBase-40"],
  }));

  return (
    <Stack gap="24p" direction="vertical">
      <Typography.Text weight="medium" size="title3">
        {t("WhatsNext.ExploreArticleScreen.eventDetails")}
      </Typography.Text>
      <Stack direction="horizontal" align="center" justify="space-between" style={styles.fullWidth} flex={1}>
        <Stack direction="horizontal" align="center" gap="16p">
          <View style={IconContainerStyle}>
            <HourGlassIcon />
          </View>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase" size="footnote">
              {t("WhatsNext.ExploreArticleScreen.openingHours")}
            </Typography.Text>
            <Typography.Text size="callout" weight="medium">
              {data.OpeningHours}
            </Typography.Text>
          </Stack>
        </Stack>
        <ChevronRightIcon color={iconColor} />
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" style={styles.fullWidth} flex={1}>
        <Stack direction="horizontal" align="center" gap="16p">
          <View style={IconContainerStyle}>
            <LocationIcon />
          </View>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase" size="footnote">
              {t("WhatsNext.ExploreArticleScreen.address")}
            </Typography.Text>
            <Typography.Text size="callout" weight="medium">
              {data.Location}
            </Typography.Text>
          </Stack>
        </Stack>
        <ChevronRightIcon color={iconColor} />
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" style={styles.fullWidth} flex={1}>
        <Stack direction="horizontal" align="center" gap="16p">
          <View style={IconContainerStyle}>
            <SellIcon />
          </View>
          <Stack direction="vertical">
            <Typography.Text color="neutralBase" size="footnote">
              {t("WhatsNext.ExploreArticleScreen.price")}
            </Typography.Text>
            <Typography.Text size="callout" weight="medium">
              {data.Price}
              {" " + t("WhatsNext.ExploreArticleScreen.currency")}
            </Typography.Text>
          </Stack>
        </Stack>
        <ChevronRightIcon color={iconColor} />
      </Stack>

      <Pressable
        style={websiteWrapperStyle}
        onPress={() => {
          openLink(data.Website);
        }}>
        <ShareIcon color={visitWebsiteColor} />
        <Typography.Text size="callout">{t("WhatsNext.ExploreArticleScreen.visitWebsite")}</Typography.Text>
      </Pressable>
    </Stack>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: "100%",
  },
});

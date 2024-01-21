import moment from "moment";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ArticleSectionType } from "../types";
import { getWhatsNextTagColorBranded } from "../utils";

interface TopTenSingleArticleProps {
  item: ArticleSectionType;
  onShowDetails: () => void;
  showDetails: boolean;
  onBackPress: () => void;
  onNextPress: () => void;
}

export default function TopTenSingleArticle({
  item,
  onShowDetails,
  showDetails,
  onBackPress,
  onNextPress,
}: TopTenSingleArticleProps) {
  const { WhatsNextCategory, Title, ContentDescription, EventDetails, Media, WhatsNextTypeId, WhatsNextType } = item;
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();

  const textColor = Media && Media[0]?.SourceFileURL ? "neutralBase-60" : "neutralBase+30";

  const articleBottom = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["24p"],
    position: "absolute",
    bottom: 82,
    maxHeight: height - 170,
    width,
  }));

  const articleBottomTitle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const articleBottomDescription = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["24p"],
  }));

  const detailsTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const handleDurationTime = (date: string, numberOfHour: number) => {
    const eventStartTime = new Date(date);
    if (numberOfHour === "All day") {
      return `${moment(eventStartTime).format("hh:mm")} - ${moment(eventStartTime).format("hh:mm")}`;
    } else {
      const eventEndTime = moment(eventStartTime).add(moment.duration(Number(numberOfHour), "hours"));
      return `${moment(eventStartTime).format("hh:mm")} - ${moment(eventEndTime).format("hh:mm")}`;
    }
  };

  return (
    <View style={{ height, width }}>
      <NetworkImage
        source={{ uri: Media ? Media[0]?.SourceFileURL : "" }}
        style={[StyleSheet.absoluteFillObject, { height, width }]}
        blurRadius={showDetails ? 5 : 0}
      />
      <LinearGradient
        style={{ ...StyleSheet.absoluteFillObject }}
        colors={["#00000000", "#000000"]}
        locations={[0.2, 0.9]}
      />
      <View style={styles.pressableContainer}>
        <Pressable onPress={onBackPress} style={styles.slideNavigationButton} />
        <Pressable onPress={onNextPress} style={styles.slideNavigationButton} />
      </View>
      <ScrollView style={articleBottom}>
        <Typography.Text size="caption2" weight="medium" color={getWhatsNextTagColorBranded(WhatsNextTypeId)}>
          {WhatsNextCategory}
          {"  "}
          {WhatsNextType}
        </Typography.Text>
        <Typography.Text color={textColor} size="title2" weight="medium" style={articleBottomTitle}>
          {Title}
        </Typography.Text>
        <Typography.Text color="neutralBase-30" size="caption1">
          {EventDetails?.Location !== undefined &&
          EventDetails?.OpeningHours !== undefined &&
          EventDetails?.EventDateTime !== undefined
            ? `${moment(EventDetails?.EventDateTime).format("LL")} . ${handleDurationTime(
                EventDetails?.EventDateTime,
                Number(EventDetails?.OpeningHours)
              )}`
            : null}
        </Typography.Text>
        <Pressable onPress={onShowDetails}>
          <Typography.Text
            color={textColor}
            size="callout"
            style={articleBottomDescription}
            numberOfLines={showDetails ? undefined : 3}>
            {ContentDescription}
          </Typography.Text>
          {showDetails !== false ? (
            <Stack direction="horizontal" gap="24p">
              <Stack direction="vertical" style={styles.columnStyle}>
                <View style={detailsTitleStyle}>
                  <Typography.Text color={textColor} size="callout" weight="medium">
                    {t("WhatsNext.TopTenArticle.location")}
                  </Typography.Text>
                </View>
                <Typography.Text color={textColor} size="caption1" weight="regular">
                  {EventDetails.Location}
                </Typography.Text>
              </Stack>
              <Stack direction="vertical" style={styles.columnStyle}>
                <View style={detailsTitleStyle}>
                  <Typography.Text color={textColor} size="callout" weight="medium">
                    {t("WhatsNext.TopTenArticle.price")}
                  </Typography.Text>
                </View>
                <Typography.Text color={textColor} size="caption1" weight="regular">
                  {EventDetails.Price} {t("WhatsNext.TopTenArticle.currency")}
                </Typography.Text>
              </Stack>
            </Stack>
          ) : null}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  columnStyle: {
    width: "50%",
  },
  pressableContainer: {
    flexDirection: "row",
    height: "100%",
    position: "relative",
  },
  slideNavigationButton: {
    height: "100%",
    width: "50%",
  },
});

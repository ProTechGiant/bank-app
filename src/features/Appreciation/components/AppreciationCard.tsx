import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon, DiamondIcon, TrendingUpIcon, ZoomInIcon as DetailsIcon } from "../assets";
import AppreciationCardImage from "../assets/appreciation-card-image.png";
import PromotedImagedivider from "../assets/promoted-image-divider.png";
import RectangleImagedivider from "../assets/rectangle-image-divider.png";

// TODO
// appreciation: unknown;  it will be replaced with actual type after BE gives us the keys of the object
interface CardPropsTypes {
  appreciation: unknown;
  isPromoted?: boolean;
}

export default function ApreciationCard({ appreciation, isPromoted = false }: CardPropsTypes) {
  const { t } = useTranslation();

  const { isNew, isRelatedToPlus, isTrending, title, date, location, endsAt, promotedDescription } = appreciation;

  const onAppreciationCardPress = () => {
    //TODO
  };

  const openPromotedHandler = () => {
    //TODO
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    width: "100%",
    height: 350,
    overflow: "hidden",
    position: "relative",
    marginVertical: theme.spacing["12p"],
  }));

  const absoluteHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: theme.spacing["8p"],
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 100,
  }));

  const detailsContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette["neutralBase-30"],
      backgroundColor: isPromoted ? theme.palette["supportBase-10"] : theme.palette["neutralBase-60"],
      height: 151,
      paddingVertical: theme.spacing["8p"],
      paddingHorizontal: theme.spacing["16p"],
    }),
    [isPromoted]
  );

  const tagStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    marginEnd: theme.spacing["16p"],
  }));

  const newtagStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette.complimentBase,
  }));

  const croatiaPlustagStyle = useThemeStyles(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const sellingFastContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  return (
    <Pressable onPress={onAppreciationCardPress}>
      <View style={containerStyle}>
        <View style={absoluteHeaderStyle}>
          <View style={styles.tagsContainer}>
            {isNew && (
              <View style={[tagStyle, newtagStyle]}>
                <Typography.Text color="supportBase-10" size="caption2" weight="medium" align="center">
                  {t("Appreciation.HubScreen.new")}
                </Typography.Text>
              </View>
            )}
            {isRelatedToPlus && (
              <View style={[tagStyle, croatiaPlustagStyle]}>
                <Typography.Text color="supportBase-10" size="caption2" weight="medium">
                  <DiamondIcon /> {t("Appreciation.HubScreen.croatiaPlus")}
                </Typography.Text>
              </View>
            )}
          </View>
          {isPromoted && (
            <Pressable onPress={openPromotedHandler}>
              <DetailsIcon />
            </Pressable>
          )}
        </View>
        <View style={styles.imageContainer}>
          <Image source={AppreciationCardImage} style={styles.image} resizeMode="cover" />
          <View style={styles.RectangleImageContainer}>
            {isPromoted ? (
              <Image source={PromotedImagedivider} style={styles.image} />
            ) : (
              <Image source={RectangleImagedivider} />
            )}
          </View>
        </View>
        <View style={detailsContainerStyle}>
          {isTrending && (
            <Stack direction="horizontal">
              <TrendingUpIcon />
              <View style={sellingFastContainerStyle}>
                <Typography.Text color="neutralBase+30" size="caption1" weight="medium">
                  {t("Appreciation.HubScreen.sellingFast")}
                </Typography.Text>
              </View>
            </Stack>
          )}
          <Stack direction="vertical" style={styles.titlelocationContainer}>
            <Typography.Text color="neutralBase+30" size="title2" weight="medium">
              {title}
            </Typography.Text>
            {!isPromoted ? (
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {location} {" . "} {date}
              </Typography.Text>
            ) : (
              <Typography.Text color="neutralBase" size="footnote" weight="regular">
                {promotedDescription}
              </Typography.Text>
            )}
          </Stack>
          <Stack direction="horizontal" gap="4p">
            <CalendarIcon />
            <Typography.Text color="neutralBase+30" size="caption2" weight="medium">
              {t("Appreciation.HubScreen.endOnMessage")} {endsAt}
            </Typography.Text>
          </Stack>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  RectangleImageContainer: {
    bottom: 0,
    height: 24,
    left: 0,
    position: "absolute",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    height: 200,
    width: "100%",
  },
  tagsContainer: {
    flexDirection: "row",
  },
  titlelocationContainer: {
    height: 68,
  },
});

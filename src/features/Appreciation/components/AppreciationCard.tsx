import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon, DiamondIcon, LikeIcon, TrendingUpIcon, ZoomInIcon as DetailsIcon } from "../assets";
import PromotedImagedivider from "../assets/promoted-image-divider.png";
import RectangleImagedivider from "../assets/rectangle-image-divider.png";
import { AppreciationType } from "../types";
interface CardPropsTypes {
  appreciation: AppreciationType;
  isPromoted?: boolean;
}

export default function ApreciationCard({ appreciation, isPromoted = false }: CardPropsTypes) {
  const { t } = useTranslation();

  const { Tier, Ranking, VoucherName, PreSaleDateTime, Location, ExpiryDate, PreSaleDescription, ImageUrl } =
    appreciation;

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

  const croatiaPlusTagStyle = useThemeStyles(theme => ({
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    marginEnd: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const sellingFastContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["4p"],
  }));

  const locationContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["4p"],
  }));

  const descriptionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["4p"],
  }));

  return (
    <Pressable onPress={onAppreciationCardPress}>
      <View style={containerStyle}>
        <View style={absoluteHeaderStyle}>
          <View style={styles.tagsContainer}>
            {Tier === 2 && (
              <View style={croatiaPlusTagStyle}>
                <Typography.Text color="supportBase-10" size="caption2" weight="medium">
                  <DiamondIcon /> {t("Appreciation.HubScreen.croatiaPlus")}
                </Typography.Text>
              </View>
            )}
          </View>
          <Pressable onPress={openPromotedHandler}>{isPromoted ? <DetailsIcon /> : <LikeIcon />}</Pressable>
        </View>
        <View style={styles.imageContainer}>
          <Image source={ImageUrl} style={styles.image} resizeMode="cover" />
          <View style={styles.RectangleImageContainer}>
            {isPromoted ? (
              <Image source={PromotedImagedivider} style={styles.image} />
            ) : (
              <Image source={RectangleImagedivider} />
            )}
          </View>
        </View>
        <View style={detailsContainerStyle}>
          {Ranking === 1 && (
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
              {VoucherName}
            </Typography.Text>
            {!isPromoted ? (
              <View style={locationContainerStyle}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {`${Location.Name} . ${PreSaleDateTime}`}
                </Typography.Text>
              </View>
            ) : (
              <View style={descriptionContainerStyle}>
                <Typography.Text color="neutralBase" size="footnote" weight="regular">
                  {PreSaleDescription}
                </Typography.Text>
              </View>
            )}
          </Stack>
          <Stack direction="horizontal" gap="4p">
            <CalendarIcon />
            <Typography.Text color="neutralBase+30" size="caption2" weight="medium">
              {t("Appreciation.HubScreen.endOnMessage")} {ExpiryDate}
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
    flexShrink: 1,
  },
});

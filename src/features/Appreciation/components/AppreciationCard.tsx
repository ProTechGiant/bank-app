import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon, LikeIcon, TrendingUpIcon, ZoomInIcon as DetailsIcon } from "../assets";
import PromotedImageDivider from "../assets/promoted-image-divider.png";
import RectangleImageDivider from "../assets/rectangle-image-divider.png";
import { AppreciationType, UserTypeEnum } from "../types";
import Tags from "./Tags";

interface CardPropsTypes {
  appreciation: AppreciationType;
  userType: UserTypeEnum;
  onPress: (appreciation: AppreciationType) => void;
  onPromptedPress: (appreciation: AppreciationType) => void;
  onLike: (appreciation: AppreciationType) => void;
}

export default function AppreciationCard({ appreciation, userType, onPress, onPromptedPress, onLike }: CardPropsTypes) {
  const { t } = useTranslation();

  const { Tier, Ranking, VoucherName, PreSaleDateTime, Location, ExpiryDate, PreSaleDescription, ImageUrl } =
    appreciation;

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
      backgroundColor: Ranking === 1 ? theme.palette["supportBase-10"] : theme.palette["neutralBase-60"],
      height: 151,
      paddingTop: theme.spacing["8p"],
      paddingBottom: theme.spacing["24p"],
      paddingHorizontal: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [Ranking]
  );

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
    <Pressable onPress={() => onPress(appreciation)}>
      <View style={containerStyle}>
        <View style={absoluteHeaderStyle}>
          <Tags isNew={true} isPlus={Tier === 1} userType={userType} />
          {Ranking === 1 ? (
            <Pressable onPress={() => onPromptedPress(appreciation)}>
              <DetailsIcon />
            </Pressable>
          ) : (
            <Pressable onPress={() => onLike(appreciation)}>
              <LikeIcon />
            </Pressable>
          )}
        </View>
        <View style={styles.imageContainer}>
          <NetworkImage source={{ uri: ImageUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.RectangleImageContainer}>
            {Ranking === 1 ? (
              <Image source={PromotedImageDivider} style={styles.image} />
            ) : (
              <Image source={RectangleImageDivider} />
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
            {Ranking !== 1 ? (
              <Typography.Text color="neutralBase" size="footnote" weight="regular" style={locationContainerStyle}>
                {`${Location.Name} . ${PreSaleDateTime}`}
              </Typography.Text>
            ) : (
              <Typography.Text color="neutralBase" size="footnote" weight="regular" style={descriptionContainerStyle}>
                {PreSaleDescription}
              </Typography.Text>
            )}
          </Stack>
          <Stack direction="horizontal" gap="4p">
            <CalendarIcon />
            <Typography.Text color="neutralBase+30" size="caption2" weight="medium">
              {t("Appreciation.HubScreen.endsOnMessage")} {ExpiryDate}
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
  titlelocationContainer: {
    flexShrink: 1,
  },
});

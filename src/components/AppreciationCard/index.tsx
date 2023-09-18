import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CalendarSmallIcon, LikeSmallIcon, TrendingUpSmallIcon } from "@/assets/icons";
import PromotedImageDivider from "@/assets/promoted-image-divider.png";
import RectangleImageDivider from "@/assets/rectangle-image-divider.png";
import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { AppreciationType } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import Tags from "../Tags";

interface AppreciationCardProps {
  appreciation: AppreciationType;
  userTier: CustomerTierEnum;
  onPress: (appreciation: AppreciationType) => void;
  onLike: (appreciation: AppreciationType) => void;
}

export default function AppreciationCard({ appreciation, userTier, onPress, onLike }: AppreciationCardProps) {
  const { t } = useTranslation();

  const { Tier, Rank, AppreciationName, PresaleDate, Location, ExpiryDate, PresaleContent, ImageUrl } = appreciation;

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
      backgroundColor: Rank === 1 ? theme.palette["supportBase-10"] : theme.palette["neutralBase-60"],
      height: 151,
      paddingTop: theme.spacing["8p"],
      paddingBottom: theme.spacing["24p"],
      paddingHorizontal: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [Rank]
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
          <Tags isNew={true} isPlus={Tier === 1} userTier={userTier} />
          <Pressable onPress={() => onLike(appreciation)}>
            <LikeSmallIcon />
          </Pressable>
        </View>
        <View style={styles.imageContainer}>
          <NetworkImage source={{ uri: ImageUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.RectangleImageContainer}>
            {Rank === 1 ? (
              <Image source={PromotedImageDivider} style={styles.image} />
            ) : (
              <Image source={RectangleImageDivider} />
            )}
          </View>
        </View>
        <View style={detailsContainerStyle}>
          {Rank === 1 ? (
            <Stack direction="horizontal">
              <TrendingUpSmallIcon />
              <View style={sellingFastContainerStyle}>
                <Typography.Text color="neutralBase+30" size="caption1" weight="medium">
                  {t("Appreciation.HubScreen.sellingFast")}
                </Typography.Text>
              </View>
            </Stack>
          ) : null}
          <Stack direction="vertical" style={styles.titlelocationContainer}>
            <Typography.Text color="neutralBase+30" size="title2" weight="medium">
              {AppreciationName}
            </Typography.Text>
            {Rank !== 1 ? (
              <Typography.Text color="neutralBase" size="footnote" weight="regular" style={locationContainerStyle}>
                {`${Location.Name} . ${format(new Date(PresaleDate), "dd/MM/yyyy · hh:mm")}`}
              </Typography.Text>
            ) : (
              <Typography.Text color="neutralBase" size="footnote" weight="regular" style={descriptionContainerStyle}>
                {PresaleContent}
              </Typography.Text>
            )}
          </Stack>
          <Stack direction="horizontal" gap="4p">
            <CalendarSmallIcon />
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

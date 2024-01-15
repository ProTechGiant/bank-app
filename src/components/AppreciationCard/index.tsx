import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { CalendarSmallIcon, LikeSmallIcon, TrendingUpSmallIcon } from "@/assets/icons";
import PromotedImageDivider from "@/assets/promoted-image-divider.png";
import RectangleImageDivider from "@/assets/rectangle-image-divider.png";
import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { ActiveEnum } from "@/features/Appreciation/types";
import { useThemeStyles } from "@/theme";
import { AppreciationType } from "@/types/Appreciation";
import { CustomerTierEnum } from "@/types/CustomerProfile";

import Tags from "../Tags";

interface AppreciationCardProps {
  appreciation: AppreciationType<boolean>;
  userTier: CustomerTierEnum;
  onPress: (appreciation: AppreciationType<boolean>) => void;
  onLike: (id: string, isLiked: boolean) => void;
  isPromoted?: boolean;
  testID?: string;
}

export default function AppreciationCard({
  appreciation,
  userTier,
  onPress,
  onLike,
  isPromoted,
  testID,
}: AppreciationCardProps) {
  const { t } = useTranslation();

  const {
    Tier,
    AppreciationName,
    PresaleDate,
    Location,
    ExpiryDate,
    AppreciationDescription,
    ImageUrl,
    ActiveFlag,
    isFavourite,
    AppreciationId,
  } = appreciation;

  const handleOnLikeIconPress = () => {
    onLike(AppreciationId, isFavourite);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.medium,
    width: Dimensions.get("window").width - 40,
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

  const likeIconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60-60%"],
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
    borderRadius: theme.spacing["64p"],
    alignItems: "center",
    justifyContent: "center",
  }));

  const likedColor = useThemeStyles(theme => theme.palette.complimentBase);

  const notLikedColor = useThemeStyles(theme => theme.palette["neutralBase-60-60%"]);

  const calendarIconColor = useThemeStyles(theme =>
    isPromoted ? theme.palette["primaryBase-70"] : theme.palette.complimentBase
  );

  const detailsContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderColor: theme.palette["neutralBase-30"],
      backgroundColor: isPromoted ? theme.palette["neutralBase+30"] : theme.palette["neutralBase-60"],
      height: 151,
      paddingTop: theme.spacing["8p"],
      paddingBottom: theme.spacing["24p"],
      paddingHorizontal: theme.spacing["16p"],
      justifyContent: "space-between",
    }),
    [isPromoted]
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
    <Pressable
      testID={testID !== undefined ? `${testID}-AppreciationPress` : undefined}
      onPress={() => onPress(appreciation)}>
      <View style={containerStyle}>
        <View style={absoluteHeaderStyle}>
          <Tags isNew={ActiveFlag !== ActiveEnum.EXPIRED ? true : false} isPlus={Tier === 1} userTier={userTier} />
          <Pressable
            testID={testID !== undefined ? `${testID}-AppreciationLikeButton` : undefined}
            onPress={handleOnLikeIconPress}
            style={likeIconContainerStyle}>
            <LikeSmallIcon color={isFavourite ? likedColor : notLikedColor} />
          </Pressable>
        </View>
        <View style={styles.imageContainer}>
          <NetworkImage source={{ uri: ImageUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.RectangleImageContainer}>
            {isPromoted ? (
              <Image source={PromotedImageDivider} style={styles.image} resizeMode="stretch" />
            ) : (
              <Image source={RectangleImageDivider} />
            )}
          </View>
        </View>
        <View style={detailsContainerStyle}>
          {isPromoted && (
            <Stack direction="horizontal">
              <TrendingUpSmallIcon />
              <View style={sellingFastContainerStyle}>
                <Typography.Text color="neutralBase+30" size="caption1" weight="medium">
                  {t("Appreciation.HubScreen.sellingFast")}
                </Typography.Text>
              </View>
            </Stack>
          )}
          <Stack direction="vertical" style={styles.titlelocationContainer}>
            <Typography.Text color={isPromoted ? "neutralBase-60" : "neutralBase+30"} size="title2" weight="medium">
              {AppreciationName}
            </Typography.Text>
            {!isPromoted && (
              <Typography.Text color="neutralBase" size="footnote" weight="regular" style={descriptionContainerStyle}>
                {AppreciationDescription}
              </Typography.Text>
            )}
            <Typography.Text color="neutralBase" size="footnote" weight="regular" style={locationContainerStyle}>
              {`${Location.Name} . ${format(new Date(ExpiryDate), "dd/MM/yyyy · hh:mm")}`}
            </Typography.Text>
          </Stack>
          <Stack direction="horizontal" gap="4p">
            <CalendarSmallIcon color={calendarIconColor} />
            <Typography.Text color={isPromoted ? "neutralBase-60" : "neutralBase+30"} size="caption2" weight="medium">
              {t("Appreciation.HubScreen.endsOnMessage")} {PresaleDate}
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

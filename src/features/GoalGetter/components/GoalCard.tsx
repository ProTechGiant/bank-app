import { formatDistanceToNowStrict } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import NetworkImage from "@/components/NetworkImage";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { Divider } from "../assets/icons";
import ProgressBar from "./ProgressBar";

interface GoalCardProps {
  name: string;
  percentage: number;
  totalAmount: number;
  dueDate: Date;
  imageUri: string;
}

export default function GoalCard({ name, percentage, totalAmount, dueDate, imageUri }: GoalCardProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const handleOnGoalCardPress = () => {
    //TODO
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    margin: theme.spacing["16p"],
    backgroundColor: "white",
    overflow: "hidden",
  }));

  const progressStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["24p"],
    width: "70%",
  }));

  const nameStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const currencyStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["12p"],
  }));

  const captionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));

  const imageDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    left: theme.spacing["20p"],
    transform: [{ rotateZ: "270deg" }, { translateX: -width * 0.25 }],
    width: "30%",
    zIndex: 1,
    position: "relative",
  }));
  return (
    <Pressable onPress={handleOnGoalCardPress} style={containerStyle}>
      <Stack direction="horizontal" style={styles.containerStack}>
        <Stack direction="vertical" style={progressStackStyle}>
          <Typography.Text weight="semiBold" style={nameStyle}>
            {name}
          </Typography.Text>
          {percentage !== 100 ? (
            <Typography.Text size="caption1" style={currencyStyle}>
              {formatCurrency(totalAmount, "SAR")}
            </Typography.Text>
          ) : (
            <View style={currencyStyle} />
          )}
          <ProgressBar percentage={percentage} />
          {percentage === 100 ? (
            <Typography.Text size="caption1" style={captionStyle} align="center" weight="bold">
              {formatCurrency(totalAmount, "SAR")} {t("GoalGetter.GoalDashboardScreen.goalCard.achieved")}
            </Typography.Text>
          ) : (
            <Typography.Text size="caption1" style={captionStyle} align="center" weight="bold">
              {totalAmount * (100 - percentage)} {t("GoalGetter.GoalDashboardScreen.goalCard.toAchieve")}{" "}
              {formatDistanceToNowStrict(dueDate)}
            </Typography.Text>
          )}
        </Stack>
        <Stack direction="horizontal" style={styles.imageContainer}>
          <View style={imageDividerStyle}>
            <Divider width={width * 0.35} height={20} color="white" />
          </View>
          <NetworkImage source={{ uri: imageUri }} style={styles.image} />
        </Stack>
      </Stack>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  containerStack: {
    justifyContent: "space-between",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    height: "100%",
    width: "25%",
  },
});

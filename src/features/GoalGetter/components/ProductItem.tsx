import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

export default function ProductItem() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    padding: theme.spacing["16p"],
    paddingBottom: theme.spacing["4p"],
    backgroundColor: theme.palette["neutralBase-60"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-10"],
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "65%",
    borderTopWidth: 1,
    borderColor: theme.palette["neutralBase-10"],
    paddingTop: theme.spacing["8p"],
  }));

  // TODO: add data from api integrations
  return (
    <Stack direction="vertical" align="stretch" gap="8p" style={containerStyle}>
      <Stack direction="horizontal" align="center" gap="8p">
        <Typography.Text size="title1" weight="bold">
          Risk Type
        </Typography.Text>
        <Pressable
          onPress={() => {
            // TODO: add navigation here
            return;
          }}>
          <InfoCircleIcon />
        </Pressable>
      </Stack>
      <Stack direction="horizontal">
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="footnote">{t("GoalGetter.ShapeYourGoalScreen.timeToAchieve")}</Typography.Text>
          <Typography.Text size="title2" weight="bold">
            12 months
          </Typography.Text>
          <Typography.Text size="caption1">{t("GoalGetter.ShapeYourGoalScreen.profitRate")}</Typography.Text>
        </Stack>
        <Stack direction="vertical" gap="4p" flex={1}>
          <Typography.Text size="footnote">{t("GoalGetter.ShapeYourGoalScreen.expectedProfit")}</Typography.Text>
          <Typography.Text size="title2" weight="bold">
            2.40%
          </Typography.Text>
          <Typography.Text size="caption1">576.00 SAR</Typography.Text>
        </Stack>
      </Stack>
      <Stack direction="vertical" style={textContainerStyle}>
        <Typography.Text size="caption2">{t("GoalGetter.ShapeYourGoalScreen.productItemTitle")}</Typography.Text>
      </Stack>
      <Stack direction="vertical" align="center" justify="center" style={styles.imageContainerStyle}>
        <Image source={require("../assets/productItem.png")} />
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  imageContainerStyle: {
    bottom: 0,
    height: 100,
    position: "absolute",
    right: 0,
    width: 100,
  },
});

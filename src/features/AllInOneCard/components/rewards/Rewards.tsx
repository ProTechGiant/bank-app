import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { RewardsIcon, RightIcon } from "../../assets/icons";
import AllInOneTag from "../AllInOneTag";

interface RewardsProps {
  onPress: () => void;
}

export default function Rewards({ onPress }: RewardsProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
  }));

  const textContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginTop: theme.spacing["16p"],
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: theme.radii.medium,
    borderColor: theme.palette["neutralBase-30"],
  }));

  return (
    <Pressable onPress={onPress}>
      <Stack style={containerStyle} direction="vertical" align="stretch">
        <Typography.Text size="title3" weight="medium">
          {t("AllInOneCard.Rewards.labelTotalCashBack")}
        </Typography.Text>
        <Stack style={textContainerStyle} direction="horizontal" gap="16p" align="flex-start">
          <RewardsIcon />
          <Stack direction="vertical" gap="8p" flex={1}>
            <AllInOneTag label="CashBack" backgroundColor="#7DF9DD" />
            {/* TODO : WHEN API/LLD Available , we will replace these hardcoded values  */}
            <Typography.Text size="callout" weight="medium">
              1,920.23 SAR
            </Typography.Text>
            <Typography.Text size="footnote" weight="regular" color="neutralBase-10">
              {t("AllInOneCard.Rewards.labelLastMonth")}
            </Typography.Text>
          </Stack>
          <View style={styles.icon}>
            <RightIcon />
          </View>
        </Stack>
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

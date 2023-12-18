import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { formatCurrency } from "@/utils";

import { MutualFundSectionIcon } from "../assets/icons";

interface MutualFundSectionProps {
  totalAmount: number;
}
export default function MutualFundSection({ totalAmount }: MutualFundSectionProps) {
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handleOnCardPress = () => {
    navigation.navigate("MutualFund.MutualFundStack");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    shadowColor: theme.palette["neutralBase+30"],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    marginRight: theme.spacing["20p"],
    marginVertical: theme.spacing["16p"],
    backgroundColor: "white",
  }));

  const progressStackStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["24p"],
    paddingHorizontal: theme.spacing["24p"],
    width: "70%",
  }));

  const nameStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const captionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["12p"],
  }));
  return (
    <Pressable onPress={handleOnCardPress} style={containerStyle}>
      <Stack direction="horizontal" style={styles.containerStack}>
        <Stack direction="vertical" style={progressStackStyle}>
          <Typography.Text weight="semiBold" style={nameStyle}>
            {t("GoalGetter.GoalDashboardScreen.mutualFund.title")}
          </Typography.Text>
          <Typography.Text size="caption1">{formatCurrency(totalAmount, "SAR")}</Typography.Text>
          <Typography.Text size="caption1" style={captionStyle} align="center">
            {t("GoalGetter.GoalDashboardScreen.mutualFund.portfolioValue")}
          </Typography.Text>
        </Stack>
        <View style={styles.mutualFundSectionIconStyle}>
          <MutualFundSectionIcon />
        </View>
      </Stack>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  containerStack: {
    justifyContent: "space-between",
  },
  mutualFundSectionIconStyle: {
    transform: [{ scaleX: !I18nManager.isRTL ? 1 : -1 }],
  },
});

import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import EmptyInvestmentsIllustration from "../assets/Empty-Investments.svg";

export default function EmptyInvestments() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-60"],
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="vertical" gap="12p" align="center" testID="MutualFund.EmptyInvestments:Stack">
        <EmptyInvestmentsIllustration />
        <Typography.Text weight="bold" align="center" size="title1">
          {t("MutualFund.EmptyInvestments.title")}
        </Typography.Text>
        <Typography.Text align="center">{t("MutualFund.EmptyInvestments.subTitle")}</Typography.Text>
      </Stack>
    </View>
  );
}

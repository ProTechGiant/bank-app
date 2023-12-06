import { useTranslation } from "react-i18next";
import { StatusBar, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

export default function MutualFundSubscriptionSummaryNavHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const contentStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: insets.top,
      backgroundColor: theme.palette.primaryBase,
    }),
    [insets.top]
  );

  return (
    <Stack direction="vertical" align="stretch" style={contentStyle}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <NavHeader
        variant="white"
        title={
          <Typography.Text color="neutralBase-60">
            {t("MutualFund.SubscriptionSummaryScreen.mutualFundsTitle")}
          </Typography.Text>
        }
      />
    </Stack>
  );
}

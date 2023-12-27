import { useTranslation } from "react-i18next";
import { StatusBar, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArrowLeftIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

export default function MutualFundDetailsNavHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const contentStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: insets.top,
      backgroundColor: theme.palette.primaryBase,
    }),
    [insets.top]
  );

  const backButtonStyle = useThemeStyles<string>(theme => theme.palette["neutralBase-60"]);

  return (
    <Stack direction="vertical" align="stretch" style={contentStyle}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <NavHeader
        variant="white"
        title={
          <Typography.Text color="neutralBase-60">
            {t("MutualFund.MutualFundDetailsScreen.mutualFundsTitle")}
          </Typography.Text>
        }
        backButton={<ArrowLeftIcon color={backButtonStyle} width={20} height={20} />}
      />
    </Stack>
  );
}

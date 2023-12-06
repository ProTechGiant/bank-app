import { useTranslation } from "react-i18next";
import { StatusBar, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { MenuIcon } from "../assets/icons";

export default function MutualFundDetailsNavHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleOnPressInfoIcon = () => {
    // add back navigation
  };

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
            {t("MutualFund.MutualFundDetailsScreen.mutualFundsTitle")}
          </Typography.Text>
        }
        end={<NavHeader.IconEndButton icon={<MenuIcon />} onPress={handleOnPressInfoIcon} />}
      />
    </Stack>
  );
}

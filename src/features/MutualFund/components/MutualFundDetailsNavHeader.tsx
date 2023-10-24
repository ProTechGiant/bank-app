import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InfoCircleIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import InformationIndicatorsModal from "./InformationIndicatorsModal";

export default function MutualFundDetailsNavHeader() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleOnPressInfoIcon = () => {
    setIsVisible(true);
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
        variant="background"
        title={
          <Typography.Text color="neutralBase-60">{t("MutualFund.MutualFundDetailsScreen.title")}</Typography.Text>
        }
        end={<NavHeader.IconEndButton icon={<InfoCircleIcon />} onPress={handleOnPressInfoIcon} />}
      />
      <InformationIndicatorsModal
        isVisible={isVisible}
        onPressInfoIcon={() => {
          setIsVisible(false);
        }}
      />
    </Stack>
  );
}

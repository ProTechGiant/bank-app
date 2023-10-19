import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { AssetIcon } from "../assets/icons";
import PieChart from "./PieChart";

export default function AssetSection() {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    width: "100%",
    marginTop: theme.spacing["16p"],
  }));

  return (
    <View>
      <Stack direction="horizontal" gap="12p">
        <AssetIcon />
        <Typography.Text color="neutralBase+30" size="title3" weight="medium">
          {t("MutualFund.MutualFundOrderDetailsScreen.assetAllocation.title")}
        </Typography.Text>
      </Stack>
      <View style={containerStyle}>
        <PieChart />
      </View>
    </View>
  );
}

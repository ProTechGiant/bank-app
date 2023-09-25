import { View, ViewStyle } from "react-native";

import { HighRiskIcon, LowRiskIcon, MediumRiskIcon, NoRiskIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette } from "@/theme/values";

interface TagsRiskProps {
  productRisk: string;
  productRiskColor: string;
}

export default function TagsRisk({ productRisk, productRiskColor }: TagsRiskProps) {
  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: productRiskColor,
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
  }));

  const { highRiskColor, mediumRiskColor, lowRiskColor, noRiskColor } = useThemeStyles(theme => ({
    highRiskColor: theme.palette.complimentBase,
    mediumRiskColor: theme.palette.warningBase,
    lowRiskColor: theme.palette.interactionBase,
    noRiskColor: theme.palette["neutralBase+10"],
  }));

  const riskIconsMap: { [key: string]: JSX.Element } = {
    [highRiskColor]: <HighRiskIcon width={12} height={12} color={palette["neutralBase-60"]} />,
    [mediumRiskColor]: <MediumRiskIcon width={12} height={12} color={palette["neutralBase-60"]} />,
    [lowRiskColor]: <LowRiskIcon width={12} height={12} color={palette["neutralBase-60"]} />,
    [noRiskColor]: <NoRiskIcon width={12} height={12} color={palette["neutralBase-60"]} />,
  };
  return (
    <View style={contentStyle}>
      <Stack direction="horizontal" align="center" gap="4p">
        {riskIconsMap[productRiskColor]}
        <Typography.Text color="neutralBase-60" align="center" size="caption1" weight="semiBold">
          {productRisk}
        </Typography.Text>
      </Stack>
    </View>
  );
}

import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { PlaceholderRefreshIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface EmptySectionProps {
  hint: string;
}

export default function EmptySection({ hint }: EmptySectionProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <View style={containerStyle}>
      <View style={iconStyle}>
        <PlaceholderRefreshIcon />
      </View>

      <Stack direction="vertical" align="center" gap="8p">
        <Typography.Text color="neutralBase+30" size="callout" weight="medium">
          {hint}
        </Typography.Text>

        <Typography.Text color="neutralBase+10" size="footnote" weight="regular">
          {t("Home.EmptySection.stayTuned")}
        </Typography.Text>
      </Stack>
    </View>
  );
}

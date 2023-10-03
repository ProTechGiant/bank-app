import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { PlaceholderRefreshIcon } from "@/assets/icons";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface RefreshSectionProps {
  hint: string;
  hasIcon?: boolean;
  hasBorder?: boolean;
  onRefreshPress: () => void;
}

export default function RefreshSection({
  hint,
  hasIcon = false,
  hasBorder = false,
  onRefreshPress,
}: RefreshSectionProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["16p"],
    alignItems: "center",
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      paddingTop: theme.spacing["12p"],
      paddingBottom: hasIcon ? theme.spacing["16p"] : 0,
      minWidth: "30%",
    }),
    [hasIcon]
  );

  const borderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <View style={[containerStyle, hasBorder && borderStyle]}>
      {hasIcon && (
        <View style={iconStyle}>
          <PlaceholderRefreshIcon />
        </View>
      )}

      <Typography.Text color="neutralBase+30" size="callout" align="center" weight="medium">
        {hint}
      </Typography.Text>

      <View style={buttonContainerStyle}>
        <Button onPress={onRefreshPress} variant="secondary" size="mini">
          {t("Home.RefreshSection.refreshButton")}
        </Button>
      </View>
    </View>
  );
}

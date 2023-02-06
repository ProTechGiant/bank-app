import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export interface RecommendationCardProps {
  inProgress: number | string;
  completed: number | string;
  earnt: number | string;
  currency: string;
}
export default function RecommendationCards({ inProgress, completed, earnt, currency }: RecommendationCardProps) {
  const cardContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginVertical: theme.spacing["8p"],
      marginHorizontal: theme.spacing["16p"],
      borderWidth: 1,
      borderColor: theme.palette["tintBase-30"],
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );
  const cardContainerInnerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      minHeight: 54,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginHorizontal: theme.spacing["16p"],
      borderRadius: theme.radii.extraSmall,
    }),
    []
  );
  const bottomBorderStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderBottomColor: theme.palette["tintBase-30"],
      borderBottomWidth: 1,
    }),
    []
  );

  const { t } = useTranslation();

  return (
    <View style={cardContainerStyle}>
      <View style={[cardContainerInnerStyle, bottomBorderStyle]}>
        <Typography.Text>{t("Referral.HubScreen.progress")}</Typography.Text>
        <Typography.Text size="callout" weight="medium">
          {inProgress}
        </Typography.Text>
      </View>
      <View style={[cardContainerInnerStyle, bottomBorderStyle]}>
        <Typography.Text>{t("Referral.HubScreen.completed")}</Typography.Text>
        <Typography.Text size="callout" weight="medium">
          {completed}
        </Typography.Text>
      </View>
      <View style={cardContainerInnerStyle}>
        <Typography.Text>{t("Referral.HubScreen.earnt")}</Typography.Text>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Typography.Text color="shadeBase-20" size="caption2">
            {currency.toUpperCase()}{" "}
          </Typography.Text>
          <Typography.Text>{earnt}</Typography.Text>
        </View>
      </View>
    </View>
  );
}

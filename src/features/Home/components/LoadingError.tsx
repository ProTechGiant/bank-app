import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { InfoIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LoadingErrorProps {
  onRefresh: () => void;
}

export default function LoadingError({ onRefresh }: LoadingErrorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["48p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "55%",
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <View style={containerStyle}>
      <InfoIcon />
      <View style={textStyle}>
        <Typography.Text size="callout" align="center">
          {t("LoadingError.noData")}
        </Typography.Text>
      </View>
      <Pressable onPress={onRefresh}>
        <Typography.Text size="callout" align="center" color="primaryBase-40">
          {t("LoadingError.reload")}
        </Typography.Text>
      </Pressable>
    </View>
  );
}

import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { InfoIcon } from "@/assets/icons";
import { LoadingErrorNotification } from "@/components";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LoadingErrorProps {
  isVisible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function LoadingError(props: LoadingErrorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    marginVertical: theme.spacing["48p"],
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "55%",
    marginTop: theme.spacing["20p"],
  }));

  return (
    <>
      <View style={containerStyle}>
        <InfoIcon />
        <View style={textStyle}>
          <Typography.Text size="callout" align="center">
            {t("LoadingError.noData")}
          </Typography.Text>
        </View>
      </View>
      <LoadingErrorNotification {...props} />
    </>
  );
}

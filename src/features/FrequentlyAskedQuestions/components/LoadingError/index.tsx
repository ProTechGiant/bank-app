import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { InfoIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NotificationModal from "@/components/NotificationModal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LoadingErrorProps {
  isVisible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function LoadingError({ isVisible, onClose, onRefresh }: LoadingErrorProps) {
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
      <NotificationModal
        variant="error"
        title={t("LoadingError.NotificationModal.errorTitle")}
        message={t("LoadingError.NotificationModal.errorMessage")}
        isVisible={isVisible}
        onClose={onClose}
        buttons={{
          primary: <Button onPress={onRefresh}>{t("LoadingError.NotificationModal.refresh")}</Button>,
          secondary: <Button onPress={onClose}>{t("LoadingError.NotificationModal.dismiss")}</Button>,
        }}
      />
    </>
  );
}

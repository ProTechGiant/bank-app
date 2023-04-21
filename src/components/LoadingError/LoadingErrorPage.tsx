import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { InfoIcon } from "@/assets/icons";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LoadingErrorPageProps {
  title?: string;
  onRefresh: () => void;
}

export default function LoadingErrorPage({ onRefresh, title }: LoadingErrorPageProps) {
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
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={title} />
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
    </Page>
  );
}

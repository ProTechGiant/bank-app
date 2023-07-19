import { useTranslation } from "react-i18next";
import { useWindowDimensions, ViewStyle } from "react-native";

import { CancelCircleFilledIcon } from "@/assets/icons";
import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface LoadingErrorPageProps {
  title?: string;
  onRefresh: () => void;
}

export default function LoadingErrorPage({ onRefresh, title }: LoadingErrorPageProps) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop:
      height / 5 - // calculation to get 20% of screen height
      theme.spacing["20p"], // remove ContentContainer Padding
  }));

  const textStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader title={title} />
      <Stack direction="vertical" gap="16p" align="center" style={containerStyle}>
        <CancelCircleFilledIcon />
        <Stack direction="vertical" gap="32p" align="center" style={textStyle}>
          <Stack direction="vertical" align="center" gap="8p">
            <Typography.Text size="title3" weight="bold" align="center">
              {t("LoadingError.title")}
            </Typography.Text>
            <Typography.Text size="callout" align="center">
              {t("LoadingError.body")}
            </Typography.Text>
          </Stack>

          <Button variant="secondary" onPress={onRefresh}>
            {t("LoadingError.reload")}
          </Button>
        </Stack>
      </Stack>
    </Page>
  );
}

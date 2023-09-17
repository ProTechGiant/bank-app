import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { CancelCircleFilledIcon } from "@/assets/icons/CancelCircleFilledIcon";
import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AppreciationErrorProps {
  onRefresh: () => void;
}

export default function AppreciationError({ onRefresh }: AppreciationErrorProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    justifyContent: "center",
    flex: 0.5,
    paddingTop: theme.spacing["64p"],
    paddingHorizontal: theme.spacing["24p"],
  }));

  const headingStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <View style={containerStyle}>
      <CancelCircleFilledIcon />

      <Stack direction="vertical" gap="8p" style={headingStyle}>
        <Typography.Text size="title3" weight="bold">
          {t("Appreciation.HubScreen.LoadingError.title")}
        </Typography.Text>
        <Typography.Text color="neutralBase-10" size="callout" align="center">
          {t("Appreciation.HubScreen.LoadingError.description")}
        </Typography.Text>
      </Stack>
      <Button variant="secondary" onPress={onRefresh}>
        {t("Appreciation.HubScreen.LoadingError.reload")}
      </Button>
    </View>
  );
}

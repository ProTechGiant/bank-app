import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface RateAppreciationProps {
  onDismissPress: () => void;
  onRatePress: () => void;
}

export default function RateAppreciation({ onDismissPress, onRatePress }: RateAppreciationProps) {
  const { t } = useTranslation();

  const textsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderTopEndRadius: theme.spacing["8p"],
    borderTopStartRadius: theme.spacing["8p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.palette["neutralBase-30"],
    borderBottomEndRadius: theme.spacing["8p"],
    borderBottomStartRadius: theme.spacing["8p"],
  }));

  return (
    <View>
      <Stack direction="vertical" style={textsContainerStyle} gap="8p">
        <Typography.Text color="neutralBase+30" size="callout" weight="medium" style={styles.textStyle}>
          {t("Home.RateAppreciation.question")}
        </Typography.Text>
        <Typography.Text color="neutralBase" size="footnote" weight="regular" style={styles.textStyle}>
          {t("Home.RateAppreciation.subtitle")}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" gap="16p" style={buttonsContainerStyle}>
        <Button variant="tertiary" onPress={onDismissPress} size="mini">
          {t("Home.RateAppreciation.dismissButton")}
        </Button>
        <Button onPress={onRatePress} size="mini">
          {t("Home.RateAppreciation.rateButton")}
        </Button>
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    flexGrow: 1,
  },
});

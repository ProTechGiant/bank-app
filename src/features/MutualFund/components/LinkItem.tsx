import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Toggle from "@/components/Toggle";
import { DownloadGoalIcon } from "@/features/GoalGetter/assets/icons";
import { useThemeStyles } from "@/theme";

interface LinkItemProps {
  name: string;
  description: string;
  onPress: () => void;
}

export default function LinkItem({ name, description, onPress }: LinkItemProps) {
  const { t } = useTranslation();
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);

  const handleOnToggle = () => {
    return true;
  };

  return (
    <Pressable onPress={onPress}>
      <Stack direction="horizontal" justify="space-between" align="center" style={styles.container}>
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="callout" weight="medium">
            {name}
          </Typography.Text>
          <Typography.Text color="neutralBase" size="footnote" weight="regular">
            {description}
          </Typography.Text>
        </Stack>
        {name === t("MutualFund.MutualFundManagmantScreen.receiveAlert") ? (
          <Toggle onPress={handleOnToggle} value={true} />
        ) : name === t("MutualFund.MutualFundManagmantScreen.printStatement") ? (
          <DownloadGoalIcon />
        ) : (
          <ChevronRightIcon color={iconColor} />
        )}
      </Stack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

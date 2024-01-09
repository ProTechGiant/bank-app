import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, StyleSheet } from "react-native";

import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import Toggle from "@/components/Toggle";
import { useAuthContext } from "@/contexts/AuthContext";
import { DownloadGoalIcon } from "@/features/GoalGetter/assets/icons";
import { useThemeStyles } from "@/theme";

import { useUpdatePreferences } from "../hooks/query-hooks";

interface LinkItemProps {
  name: string;
  description: string;
  onPress: () => void;
}

export default function LinkItem({ name, description, onPress }: LinkItemProps) {
  const { t } = useTranslation();
  const iconColor = useThemeStyles<string>(theme => theme.palette["neutralBase-20"]);
  const updatePreferences = useUpdatePreferences();
  const [preferencies, setPreferencies] = useState(false);
  const { userId } = useAuthContext();

  const handleOnToggle = () => {
    setPreferencies(prevPreferencies => !prevPreferencies);
    try {
      updatePreferences.mutateAsync({
        CustomerId: `${userId}`,
        Preferences: [
          {
            SubCategoryId: "51",
            ChannelId: "d8986e72-d863-11ed-afa1-0242ac120002",
            IsPreferred: false,
          },
        ],
      });
    } catch (e) {}
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
          <Toggle onPress={handleOnToggle} value={preferencies} />
        ) : name === t("MutualFund.MutualFundManagmantScreen.printStatement") ? (
          <DownloadGoalIcon />
        ) : I18nManager.isRTL ? (
          <ChevronLeftIcon color={iconColor} />
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

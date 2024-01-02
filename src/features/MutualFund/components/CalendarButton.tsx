import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { CalendarIcon } from "../assets/icons";

interface CalendarButtonProps {
  selectedDate: string;
  onClick: () => void;
}

export default function CalendarButton({ selectedDate, onClick }: CalendarButtonProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.small,
    marginBottom: theme.spacing["16p"],
    marginTop: theme.spacing["12p"],
  }));

  return (
    <Pressable onPress={onClick}>
      <View style={containerStyle}>
        <Stack direction="horizontal" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {selectedDate}
          </Typography.Text>
          <Stack direction="horizontal" gap="8p">
            <CalendarIcon />
            <Typography.Text color="complimentBase">{t("GoalGetter.ShapeGoalScreen.set")}</Typography.Text>
          </Stack>
        </Stack>
      </View>
    </Pressable>
  );
}

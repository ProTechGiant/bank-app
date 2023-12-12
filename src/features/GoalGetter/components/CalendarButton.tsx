import format from "date-fns/format";
import arLocale from "date-fns/locale/ar";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { CalendarIcon } from "../assets/icons";

interface CalendarButtonProps {
  selectedDate: string;
  onClick: () => void;
  label?: string;
}

export default function CalendarButton({ selectedDate, onClick, label }: CalendarButtonProps) {
  const { t } = useTranslation();
  const currentDateInNumber = format(new Date(), "yyyy-MM-dd");
  const currentDate = I18nManager.isRTL
    ? format(new Date(), "dd MMMM yyyy", { locale: arLocale })
    : format(new Date(), "dd MMMM yyyy");

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
        {label ? (
          <Typography.Text color="neutralBase+10" size="caption1">
            {label}
          </Typography.Text>
        ) : null}

        <Stack direction="horizontal" justify="space-between">
          <Typography.Text color="neutralBase+30" size="callout" weight="regular">
            {selectedDate === currentDate || selectedDate === currentDateInNumber
              ? t("GoalGetter.ShapeGoalScreen.monthAndYear")
              : selectedDate}
          </Typography.Text>
          <Stack direction="horizontal" gap="8p">
            <CalendarIcon />
            {label ? (
              <Typography.Text color="complimentBase">{t("GoalGetter.ShapeGoalScreen.set")}</Typography.Text>
            ) : null}
          </Stack>
        </Stack>
      </View>
    </Pressable>
  );
}

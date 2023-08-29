import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { CalendarIcon } from "../assets";

interface AppreciationEventDetailsSectionProps {
  endDate: string;
  location: string;
  preSaleDate: string;
  preSaleDescription: string;
}
export default function AppreciationEventDetailsSection({
  endDate,
  location,
  preSaleDate,
  preSaleDescription,
}: AppreciationEventDetailsSectionProps) {
  const { t } = useTranslation();

  const addDateToCalendar = () => {
    // TODO:intagrate react native add calendar event
  };

  const dateContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
  }));

  const addToCalendarStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["8p"],
  }));

  return (
    <Stack gap="12p" direction="vertical">
      <Typography.Text weight="medium" size="title3">
        {t("Appreciation.AppreciationDetailsSection.eventDetails")}
      </Typography.Text>

      <View>
        <View style={dateContainerStyle}>
          <Typography.Text color="neutralBase" weight="regular" size="footnote">
            {t("Appreciation.AppreciationDetailsSection.eventDate")}
          </Typography.Text>
          <Typography.Text size="callout">{endDate}</Typography.Text>
        </View>
        <Pressable onPress={addDateToCalendar}>
          <Stack direction="horizontal" align="center">
            <CalendarIcon />
            <Typography.Text color="neutralBase" size="callout" style={addToCalendarStyle}>
              {t("Appreciation.AppreciationDetailsSection.addToCalendar")}
            </Typography.Text>
          </Stack>
        </Pressable>
      </View>

      <View>
        <Typography.Text color="neutralBase" size="footnote">
          {t("Appreciation.AppreciationDetailsSection.location")}
        </Typography.Text>
        <Typography.Text size="callout">{location}</Typography.Text>
      </View>

      <View>
        <Typography.Text color="neutralBase" size="footnote">
          {t("Appreciation.AppreciationDetailsSection.PreSaleAvailability")}
        </Typography.Text>
        <Typography.Text size="callout">{preSaleDate}</Typography.Text>
        <Typography.Text size="callout">{preSaleDescription}</Typography.Text>
      </View>
    </Stack>
  );
}

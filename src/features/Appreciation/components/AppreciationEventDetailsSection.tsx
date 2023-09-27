import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";
import { presentEventCreatingDialog } from "react-native-add-calendar-event";

import { CalendarSmallIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface AppreciationEventDetailsSectionProps {
  appreciationName: string;
  endDate: string;
  location: string;
  preSaleDate: string;
  preSaleDescription: string;
}
export default function AppreciationEventDetailsSection({
  appreciationName,
  endDate,
  location,
  preSaleDate,
  preSaleDescription,
}: AppreciationEventDetailsSectionProps) {
  const { t } = useTranslation();

  const formatedPreSaleDate = format(new Date(preSaleDate), "dd/MM/yyyy · hh:mm");
  const addDateToCalendar = () => {
    const eventConfig = {
      title: appreciationName,
      startDate: format(new Date(preSaleDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      endDate: format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      location,
    };
    presentEventCreatingDialog(eventConfig)
      .then((_eventInfo: unknown) => {
        // TODO PA team will provide message success  to show
      })
      .catch((_error: string) => {
        // TODO PA team will provide message error to show
      });
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
          <Typography.Text size="callout">{formatedPreSaleDate}</Typography.Text>
        </View>
        <Pressable onPress={addDateToCalendar}>
          <Stack direction="horizontal" align="center">
            <CalendarSmallIcon />
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

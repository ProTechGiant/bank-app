import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { presentEventCreatingDialog } from "react-native-add-calendar-event";

import { CalendarSmallIcon } from "@/assets/icons";
import Button from "@/components/Button";
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

  const formatedEndDate = format(new Date(endDate), "dd/MM/yyyy · hh:mm");
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

      <View style={dateContainerStyle}>
        <Typography.Text color="neutralBase" weight="regular" size="footnote">
          {t("Appreciation.AppreciationDetailsSection.eventDate")}
        </Typography.Text>
        <Typography.Text size="callout">{formatedEndDate}</Typography.Text>
      </View>
      <Button onPress={addDateToCalendar} variant="secondary">
        <Stack direction="horizontal" align="center">
          <CalendarSmallIcon />
          <Typography.Text weight="medium" style={addToCalendarStyle}>
            {t("Appreciation.AppreciationDetailsSection.addToCalendar")}
          </Typography.Text>
        </Stack>
      </Button>

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

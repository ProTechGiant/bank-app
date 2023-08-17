import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, View, ViewStyle } from "react-native";

import { ChevronRightIcon } from "@/assets/icons";
import Button from "@/components/Button";
import CustomCalendar from "@/components/CustomCalendar";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, radii } from "@/theme/values";

interface SelectCustomDateModalType {
  isSelectingStartDate: boolean;
  selectedDate: string;
  visible: boolean;
  onClose: () => void;
  onPickDate: (isItStartDate: boolean, date: string) => void;
}

export default function SelectCustomDateModal({
  isSelectingStartDate,
  selectedDate,
  visible,
  onClose,
  onPickDate,
}: SelectCustomDateModalType) {
  const { t } = useTranslation();

  const [date, setDate] = useState<string>(selectedDate);

  const handleDayPress = (day: { dateString: string }) => {
    setDate(day.dateString);
  };

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate, visible]);

  return (
    <Modal
      headerText={
        isSelectingStartDate
          ? t("Statements.RequestStatementScreen.startingDate")
          : t("Statements.RequestStatementScreen.endDate")
      }
      visible={visible}
      onClose={onClose}>
      <Stack direction="vertical" gap="24p" align="stretch">
        <Stack direction="vertical" align="stretch">
          <Header date={date} />
          <CustomCalendar
            onDayPress={handleDayPress}
            markedDates={{
              [date]: {
                selected: true,
                customContainerStyle: {
                  borderRadius: radii.small,
                  backgroundColor: palette.primaryBase,
                },
              },
            }}
            markingType="period"
          />
        </Stack>
        <Button onPress={() => onPickDate(isSelectingStartDate, date)} disabled={!date}>
          {t("Statements.RequestStatementScreen.pickDate")}
        </Button>
      </Stack>
    </Modal>
  );
}

const Header = ({ date }: { date: string }) => {
  const calendarHeaderStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.palette["neutralBase-30"],
    padding: theme.spacing["12p"],
  }));

  const chevronIconColor = useThemeStyles(theme => theme.palette["neutralBase-20"]);

  return (
    <Stack direction="horizontal" justify="space-between" align="center" style={calendarHeaderStyle}>
      <Typography.Text size="title3" weight="regular" color="neutralBase+30">
        {date ? format(parseISO(date), "d MMM yyyy") : null}
      </Typography.Text>
      <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
        <ChevronRightIcon height={20} color={chevronIconColor} />
      </View>
    </Stack>
  );
};

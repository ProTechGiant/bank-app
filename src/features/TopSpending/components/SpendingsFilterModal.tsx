import { addDays, format, isBefore, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextStyle, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { palette, radii } from "@/theme/values";

import DiamondIcon from "../assets/icons/DiamondIcon";
import { userType } from "../mocks";
import { CompareDatesTypes } from "../types";
import CompareModel from "./CompareModal";
import CustomCalendar from "./CustomCalendar";

interface SpendingsFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onBack?: () => void;
  handleOnDayPressEvent: (fromDate: string, toDate: string) => void;
  onCompare: (date: CompareDatesTypes, type: string) => void;
}

enum ModalScreens {
  Main,
  ComparePeriods,
}

export default function SpendingsFilterModal({
  isVisible,
  onClose,
  handleOnDayPressEvent,
  onCompare,
}: SpendingsFilterModalProps) {
  const { t } = useTranslation();

  const [currentScreen, setCurrentScreen] = useState(ModalScreens.Main);
  const [headerText, setHeaderText] = useState(t("TopSpending.SpendingDateFilter.selectDate"));

  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);

  const handleCompareOption = (screen: ModalScreens, textHeader: string) => {
    setCurrentScreen(screen);
    setHeaderText(textHeader);
  };

  const goBackTo = (screen: ModalScreens) => {
    handleCompareOption(screen, t("TopSpending.SpendingDateFilter.selectDate"));
  };

  useEffect(() => {
    if (!isVisible) {
      setCurrentScreen(ModalScreens.Main);
      setHeaderText(t("TopSpending.SpendingDateFilter.selectDate"));
      setStartDay(null);
      setEndDay(null);
      setMarkedDates({});
    }
  }, [isVisible, t]);

  const onDayPressEvent = (day: { dateString: string }) => {
    if (startDay && !endDay) {
      const date: { [key: string]: any } = {};
      for (
        let d = new Date(startDay);
        isBefore(d, new Date(day.dateString)) || isSameDay(d, new Date(day.dateString));
        d = addDays(d, 1)
      ) {
        const formattedDate = format(d, "yyyy-MM-dd");
        date[formattedDate] = {
          color: palette.primaryBase,
          textColor: palette["neutralBase-60"],
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        };

        if (formattedDate === startDay) date[formattedDate].startingDay = true;
        if (formattedDate === day.dateString) date[formattedDate].endingDay = true;
      }

      setMarkedDates(date);
      setEndDay(day.dateString);
    } else {
      setStartDay(day.dateString);
      setEndDay(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: palette.primaryBase,
          textColor: palette["neutralBase-60"],
          customContainerStyle: {
            borderRadius: radii.extraSmall,
          },
        },
      });
    }
  };

  const modalContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    maxHeight: "85%",
    minHeight: "75%",
  }));

  const warningTextStyle = useThemeStyles<TextStyle>(theme => ({ padding: theme.spacing["16p"], textAlign: "center" }));

  return (
    <Modal
      style={modalContainerStyle}
      onBack={
        currentScreen !== ModalScreens.Main
          ? () => handleCompareOption(ModalScreens.Main, t("TopSpending.SpendingDateFilter.selectDate"))
          : undefined
      }
      headerText={headerText}
      visible={isVisible}
      onClose={currentScreen !== ModalScreens.Main ? () => goBackTo(ModalScreens.Main) : onClose}>
      {currentScreen === ModalScreens.Main ? (
        <>
          <CustomCalendar hideArrows markingType="period" onDayPress={onDayPressEvent} markedDates={markedDates} />
          <Typography.Text color="neutralBase" size="caption1" weight="regular" style={warningTextStyle}>
            {t("TopSpending.SpendingDateFilter.noTransactionWarning")}
          </Typography.Text>
          <Button
            onPress={() => {
              onClose();
              if (startDay && endDay) {
                handleOnDayPressEvent(startDay.toString(), endDay.toString());
              }
            }}>
            {t("TopSpending.SpendingDateFilter.pickPeriod")}
          </Button>
          <Button
            iconRight={userType !== "plusTier" ? <DiamondIcon /> : undefined}
            disabled={userType !== "plusTier"}
            variant="tertiary"
            onPress={() =>
              handleCompareOption(ModalScreens.ComparePeriods, t("TopSpending.SpendingDateFilter.comparePeriod"))
            }>
            {t("TopSpending.SpendingDateFilter.compare")}
          </Button>
        </>
      ) : (
        <CompareModel
          isVisible={true}
          onCompare={onCompare}
          onClose={() => onClose()}
          onBack={() => handleCompareOption(ModalScreens.Main, t("TopSpending.SpendingDateFilter.selectDate"))}
        />
      )}
    </Modal>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TimeFrameInterface } from "../types";
import { formatTimeRange, generateTimeFrames } from "../utils";

interface SelectTimeFrameSectionProps {
  selectedTimeFrame: TimeFrameInterface | null;
  onSelectTimeFrame: (timeFrame: TimeFrameInterface) => void;
  onboardingDate: string;
}

export default function SelectTimeFrameSection({
  selectedTimeFrame,
  onSelectTimeFrame,
  onboardingDate,
}: SelectTimeFrameSectionProps) {
  const { t } = useTranslation();

  const timeFrameSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["20p"],
    marginBottom: theme.spacing["24p"],
  }));

  const horizontalTimeFrameStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const timeFramelabelStyle = useThemeStyles<TextStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
  }));

  const calendarIconColor = useThemeStyles(theme => theme.palette["primaryBase-50"]);

  const sectionBreakerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: "100%",
    backgroundColor: theme.palette["neutralBase-40"],
    height: 4,
  }));

  return (
    <>
      <Stack direction="vertical" align="stretch" style={timeFrameSectionStyle} gap="16p">
        <Typography.Text size="title2" weight="medium" color="neutralBase+30" style={timeFramelabelStyle}>
          {t("Statements.RequestStatementScreen.chooseTimeFrame")}
        </Typography.Text>
        <Stack direction="vertical" gap="12p">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Stack direction="horizontal" gap="8p" style={horizontalTimeFrameStyle}>
              {generateTimeFrames(onboardingDate, t).map(timeFrame => (
                <Pill
                  key={timeFrame.label}
                  isActive={selectedTimeFrame?.label === timeFrame.label}
                  onPress={() => onSelectTimeFrame(timeFrame)}>
                  {timeFrame.label}
                </Pill>
              ))}
            </Stack>
          </ScrollView>
          {selectedTimeFrame ? (
            <Stack direction="horizontal" align="center" style={timeFramelabelStyle} gap="8p">
              <CalendarAltIcon height={18} width={18} color={calendarIconColor} />
              <Typography.Text size="footnote" weight="regular" color="neutralBase">
                {formatTimeRange(selectedTimeFrame)}
              </Typography.Text>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
      <Stack direction="horizontal" align="center" justify="space-between" style={timeFramelabelStyle}>
        <View style={[sectionBreakerStyle, styles.halfSectionBreakerStyle]} />
        <Typography.Text size="title3" weight="medium" color="neutralBase-10">
          {t("Statements.RequestStatementScreen.or")}
        </Typography.Text>
        <View style={[sectionBreakerStyle, styles.halfSectionBreakerStyle]} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  halfSectionBreakerStyle: {
    width: "43%",
  },
});

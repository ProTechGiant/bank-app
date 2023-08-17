import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { CalendarAltIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface SetMonthRowCardType {
  label: string;
  onPressSetDate: () => void;
  selectedMonth?: string | null;
}

export default function SetMonthRowCard({ label, onPressSetDate, selectedMonth }: SetMonthRowCardType) {
  const { t } = useTranslation();

  const selectMonthItemStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-50"],
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 53,
    borderRadius: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["16p"],
  }));

  const calendarIconStyle = useThemeStyles<TextStyle>(theme => ({
    color: theme.palette.complimentBase,
  }));

  return (
    <View style={selectMonthItemStyle}>
      <Typography.Text size="callout" weight="medium" color="neutralBase+30">
        {label}
      </Typography.Text>
      <Pressable style={styles.selectedMonthContainerStyle} onPress={onPressSetDate}>
        <CalendarAltIcon color={calendarIconStyle.color} width={17} height={19} />
        <Typography.Text size="callout" weight="medium" color="complimentBase">
          {selectedMonth ? selectedMonth : t("TopSpending.TopSpendingScreen.SelectMonthModal.set")}
        </Typography.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  selectedMonthContainerStyle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});

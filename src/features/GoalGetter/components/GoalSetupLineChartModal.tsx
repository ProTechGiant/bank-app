import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Stack, Typography } from "@/components";
import GoldLineChart from "@/components/GoldLineChart";
import NavHeader from "@/components/NavHeader";
import useGoldPerformance from "@/hooks/use-gold-performance";
import { useThemeStyles } from "@/theme";
import { TabsTypes } from "@/types/GoldChart";

interface GoalSetupLineChartModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function GoalSetupLineChartModal({ isVisible, onClose }: GoalSetupLineChartModalProps) {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState(TabsTypes.Week);
  const { data } = useGoldPerformance(chartType);

  const updateChartType = (type: any) => {
    setChartType(type);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.medium,
  }));

  const pieChartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    width: "100%",
    marginTop: theme.spacing["16p"],
  }));

  const detailsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["12p"],
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: theme.radii.medium,
    marginVertical: theme.spacing["4p"],
    paddingVertical: theme.spacing["24p"],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <View style={contentStyle}>
          <NavHeader
            title={t("GoalGetter.GoalSetupLineChartModal.title")}
            end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={onClose} />}
            withBackButton={false}
          />
          <Stack direction="vertical" gap="8p">
            <Typography.Text weight="bold" size="title3">
              {t("GoalGetter.GoalSetupLineChartModal.goldMarketPerformance")}
            </Typography.Text>
            <Stack direction="horizontal" gap="4p">
              <Typography.Text weight="regular" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.currentGoldPrice")}
              </Typography.Text>
              <Typography.Text weight="bold" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.currencyRate", { amount: "201" })}
              </Typography.Text>
            </Stack>
          </Stack>
          <View style={pieChartContainerStyle}>
            <GoldLineChart updateChartType={updateChartType} data={data?.DailyData} hasFiveYears={true} />
          </View>
          <View>
            <View style={detailsContainerStyle}>
              <Typography.Text weight="medium" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.gram", { count: 5 })}
              </Typography.Text>
              <Typography.Text weight="regular" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.currencyValue", { currencyValue: 5 * data?.CurrentGoldPrice })}
              </Typography.Text>
            </View>
            <View style={detailsContainerStyle}>
              <Typography.Text weight="medium" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.gram", { count: 10 })}
              </Typography.Text>
              <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
                {t("GoalGetter.GoalSetupLineChartModal.currencyValue", { currencyValue: 10 * data?.CurrentGoldPrice })}
              </Typography.Text>
            </View>
            <View style={detailsContainerStyle}>
              <Typography.Text weight="medium" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.gram", { count: 40 })}
              </Typography.Text>
              <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
                {t("GoalGetter.GoalSetupLineChartModal.currencyValue", { currencyValue: 40 * data?.CurrentGoldPrice })}
              </Typography.Text>
            </View>
            <View style={detailsContainerStyle}>
              <Typography.Text weight="medium" size="footnote">
                {t("GoalGetter.GoalSetupLineChartModal.gram", { count: 50 })}
              </Typography.Text>
              <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
                {t("GoalGetter.GoalSetupLineChartModal.currencyValue", { currencyValue: 50 * data?.CurrentGoldPrice })}
              </Typography.Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { YTDIcon } from "../assets/icons";
import PieChart from "./PieChart";

interface GoalSetupPieChartModalProps {
  isVisible: boolean;
  onClose: () => void;
}

//  TODO: all this value will change when api is ready
export default function GoalSetupPieChartModal({ isVisible, onClose }: GoalSetupPieChartModalProps) {
  const { t } = useTranslation();

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

  const iconContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["4p"],
    paddingLeft: theme.spacing["4p"],
  }));

  const ytdContentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["12p"],
    flexDirection: "row",
    borderRadius: theme.radii.medium,
  }));

  const pieChartContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    paddingVertical: theme.spacing["16p"],
    paddingHorizontal: theme.spacing["12p"],
    width: "100%",
    marginTop: theme.spacing["16p"],
    marginBottom: theme.spacing["12p"],
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
            title={t("GoalGetter.GoalSetupPieChartModal.title")}
            end={<NavHeader.IconEndButton icon={<CloseIcon />} onPress={onClose} />}
            withBackButton={false}
          />

          <View style={styles.flexDirectionRowSpaceBetween}>
            <Typography.Text weight="medium" size="title3">
              {t("GoalGetter.GoalSetupPieChartModal.fundRisk", { risk: "(low risk)" })}
            </Typography.Text>
            <View style={ytdContentContainerStyle}>
              <Typography.Text weight="regular" size="footnote">
                {t("GoalGetter.GoalSetupPieChartModal.ytd", { value: "8.11" })}
              </Typography.Text>
              <View style={iconContainerStyle}>
                <YTDIcon />
              </View>
            </View>
          </View>

          <View style={pieChartContainerStyle}>
            <PieChart />
          </View>

          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.unitPrice")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.unitPriceValue", { value: "503.82" })}
            </Typography.Text>
          </View>
          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.subscriptionFee")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
              {t("GoalGetter.GoalSetupPieChartModal.subscriptionValue", { value: "2" })}
            </Typography.Text>
          </View>
          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.minimumSubscriptionAmount")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
              {t("GoalGetter.GoalSetupPieChartModal.minimumSubscriptionValue", { value: "503.82" })}
            </Typography.Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexDirectionRowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

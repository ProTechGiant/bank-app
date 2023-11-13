import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, View, ViewStyle } from "react-native";

import { CloseIcon } from "@/assets/icons";
import { Typography } from "@/components";
import NavHeader from "@/components/NavHeader";
import { useThemeStyles } from "@/theme";

import { YTDIcon } from "../assets/icons";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useMutualFund } from "../hooks/query-hooks";
import PieChart from "./PieChart";

interface GoalSetupPieChartModalProps {
  isVisible: boolean;
  onClose: () => void;
}
interface DistributionProps {
  Name: string;
  Amount: number;
  Percentage: number;
  Icon: string;
}
export default function GoalSetupPieChartModal({ isVisible, onClose }: GoalSetupPieChartModalProps) {
  const { t } = useTranslation();
  const { ProductId } = useGoalGetterContext();

  const { data } = useMutualFund(ProductId);

  const mapDistributionToInvestments = (Distribution: DistributionProps[]) => {
    return Distribution.map(item => ({
      assetName: item.Name,
      percentage: `${item.Percentage}%`,
      investmentAmount: `${item.Amount}`,
      color: item.Icon,
    }));
  };

  const transformedInvestments = data ? mapDistributionToInvestments(data.Distribution) : [];

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
    position: "absolute",
  }));

  const ytdContentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    paddingHorizontal: theme.spacing["12p"],
    flexDirection: "row",
    borderRadius: theme.radii.medium,
    position: "relative",
    paddingLeft: theme.spacing["20p"],
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
              {data?.Name}
            </Typography.Text>
            <View style={ytdContentContainerStyle}>
              <Typography.Text weight="regular" size="footnote">
                {t("GoalGetter.GoalSetupPieChartModal.ytd", { value: data?.Ytd })}
              </Typography.Text>
              <View style={iconContainerStyle}>
                <YTDIcon />
              </View>
            </View>
          </View>

          <View style={pieChartContainerStyle}>
            <PieChart assets={transformedInvestments} />
          </View>

          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.unitPrice")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.unitPriceValue", { value: data?.UnitPrice })}
            </Typography.Text>
          </View>
          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.subscriptionFee")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
              {t("GoalGetter.GoalSetupPieChartModal.subscriptionValue", { value: data?.SubscriptionFee })}
            </Typography.Text>
          </View>
          <View style={detailsContainerStyle}>
            <Typography.Text weight="medium" size="footnote">
              {t("GoalGetter.GoalSetupPieChartModal.minimumSubscriptionAmount")}
            </Typography.Text>
            <Typography.Text weight="regular" size="footnote" color="neutralBase+10">
              {t("GoalGetter.GoalSetupPieChartModal.minimumSubscriptionValue", { value: data?.MinimumSubscription })}
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

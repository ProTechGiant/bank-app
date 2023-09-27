import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { mockPieChartData } from "../mocks/mockPieChartData";
import PieChart from "./PieChart";

interface DonutChartProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DonutChart({ isVisible, onClose }: DonutChartProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
    borderRadius: theme.radii.xlarge,
    borderTopStartRadius: theme.radii.xlarge,
    borderTopEndRadius: theme.radii.xlarge,
  }));

  const sectionsTextStyle = useThemeStyles<TextStyle>(theme => ({
    paddingVertical: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["4p"],
  }));

  const buttonStyle = useThemeStyles<ViewStyle>(theme => ({ marginVertical: theme.spacing["20p"] }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <View style={contentStyle}>
          <NavHeader
            title={t("GoalGetter.SelectProductsScreen.productMatchCard.DonutChart.header")}
            withBackButton={false}
            end={<NavHeader.CloseEndButton onPress={onClose} />}
          />
          <Typography.Text size="title1" weight="medium" style={sectionsTextStyle}>
            {t("GoalGetter.SelectProductsScreen.productMatchCard.DonutChart.title")}
          </Typography.Text>

          <View>
            <PieChart data={mockPieChartData} />
          </View>
          <View style={buttonStyle}>
            <Button onPress={onClose}>
              {t("GoalGetter.SelectProductsScreen.productMatchCard.DonutChart.okButton")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

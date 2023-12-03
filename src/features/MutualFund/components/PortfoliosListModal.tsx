import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Button from "@/components/Button";
import NavHeader from "@/components/NavHeader";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SelectPortfolioIcon, UnSelectPortfolioIcon } from "../assets/icons";

interface Portfolio {
  PortfolioId: number;
  PortfolioName: string;
}

interface PortfoliosListModalProps {
  isVisible: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
  selectedPortfolioId: number | null;

  onSelect: (selectedId: number) => void;
}

export default function PortfoliosListModal({
  isVisible,
  onClose,
  portfolios,
  onSelect,
  selectedPortfolioId,
}: PortfoliosListModalProps) {
  const { t } = useTranslation();

  const [hasSelectionChanged, setHasSelectionChanged] = useState<boolean>(false);
  const [selectedPortfolioKey, setSelectedPortfolioKey] = useState<string | null>(null);
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    if (isVisible && portfolios.length > 0) {
      if (selectedPortfolioId !== null) {
        const matchingPortfolioIndex = portfolios.findIndex(p => p.PortfolioId === selectedPortfolioId);
        const selectedKey =
          matchingPortfolioIndex >= 0
            ? `${portfolios[matchingPortfolioIndex].PortfolioId}-${matchingPortfolioIndex}`
            : null;
        setSelectedPortfolioKey(selectedKey);
      } else {
        setSelectedPortfolioKey(null);
      }
      setHasSelectionChanged(false);
    }
  }, [isVisible, portfolios, selectedPortfolioId]);

  const handleSelectPortfolio = (id: number, index: number) => {
    const selectedKey = `${id}-${index}`;
    if (selectedPortfolioKey === selectedKey) {
      setSelectedPortfolioKey(null);
      setHasSelectionChanged(selectedKey !== `${portfolios[0].PortfolioId}-0`);
    } else {
      setSelectedPortfolioKey(selectedKey);
      setHasSelectionChanged(true);
    }
  };

  const handleSaveSelection = () => {
    if (selectedPortfolioKey !== null) {
      const id = parseInt(selectedPortfolioKey.split("-")[0], 10);
      onSelect(id);
    }
    onClose();
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.palette["neutralBase-20-30%"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.xlarge,
    backgroundColor: theme.palette["neutralBase-60"],
    paddingHorizontal: theme.spacing["12p"],
    height: screenHeight / 2,
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing["12p"],
  }));

  const buttonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["20p"],
  }));

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={containerStyle}>
        <View style={contentContainerStyle}>
          <NavHeader
            title={t("MutualFund.PortfolioDetailsHeaderContent.Portfolios")}
            withBackButton={false}
            end={<NavHeader.CloseEndButton onPress={onClose} />}
            testID="MutualFund.PortfoliosListModal:NavHeader"
          />

          <ScrollView style={style.flex1}>
            {portfolios?.map((portfolio, index) => {
              const key = `${portfolio.PortfolioId}-${index}`;
              return (
                <Pressable
                  key={key}
                  onPress={() => handleSelectPortfolio(portfolio.PortfolioId, index)}
                  style={contentStyle}
                  testID={`MutualFund.PortfoliosListModal:Pressable:${key}`}>
                  <Typography.Text>{portfolio.PortfolioName}</Typography.Text>
                  {selectedPortfolioKey === key ? <SelectPortfolioIcon /> : <UnSelectPortfolioIcon />}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={buttonContainer}>
            <Button
              onPress={handleSaveSelection}
              disabled={!hasSelectionChanged}
              testID="MutualFund.PortfoliosListModal:Button">
              {t("Settings.FinancialInformation.selectButton")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});

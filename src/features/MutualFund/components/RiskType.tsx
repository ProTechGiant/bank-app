import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, TextInput, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface DataProps {
  Description: string;
  Icon: string;
  Id: number;
  Name: "LOW" | "MEDIUM" | "HIGH";
}

interface RiskTypeInterface {
  selectedRisk: number | undefined;
  data: {
    Risks: DataProps[];
  };
  onRiskPress: (id: number) => void;
  onUserInputChange: (userInput: string) => void;
}

export default function RiskType({ onRiskPress, data, selectedRisk, onUserInputChange }: RiskTypeInterface) {
  const [userInput, setUserInput] = useState("");
  const { t } = useTranslation();

  const riskIconLookUp = {
    LOW: require("../assets/lowRisk.png"),
    MEDIUM: require("../assets/mediumRisk.png"),
    HIGH: require("../assets/highRisk.png"),
  };

  const boxContainer = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    gap: theme.spacing["12p"],
  }));

  const riskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["12p"],
    minWidth: 61,
    minHeight: 72,
  }));

  const selectedRiskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["32p"],
    height: theme.spacing["32p"],
  }));

  const textInputContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    minHeight: 74,
    minWidth: 350,
    borderWidth: 1,
    borderColor: theme.palette.supportBase,
    paddingHorizontal: theme.spacing["20p"],
    paddingVertical: theme.spacing["16p"],
    borderRadius: theme.radii.small,
    fontSize: theme.typography.text.sizes.footnote,
    fontWeight: theme.typography.text.weights.regular,
    marginTop: theme.spacing["24p"],
  }));

  return (
    <Stack direction="vertical" style={boxContainer} testID="MutualFund.RiskAppetite-RiskType">
      <Stack direction="horizontal" gap="8p">
        {data.Risks.map(risk => (
          <Stack key={risk.Id} direction="vertical" gap="16p">
            <Pressable
              onPress={() => {
                onRiskPress(risk.Id);
              }}
              testID="MutualFund.RiskAppetite-RiskType:Pressable"
              style={[riskBoxContainer, selectedRisk === risk.Id && selectedRiskBoxContainer]}>
              <Stack direction="vertical" align="center" justify="center" style={iconContainer}>
                <Image source={riskIconLookUp[risk.Name]} />
              </Stack>
              <Typography.Text
                size="caption1"
                weight="medium"
                color={selectedRisk === risk.Id ? "supportBase-30" : "neutralBase+30"}>
                {risk.Name}
              </Typography.Text>
            </Pressable>
          </Stack>
        ))}
      </Stack>
      <TextInput
        style={textInputContainerStyle}
        onChangeText={text => {
          setUserInput(text);
          onUserInputChange(text);
        }}
        value={userInput}
        multiline={true}
        placeholder={t("MutualFund.RisksAppetiteScreen.inputPlaceHolder")}
      />
    </Stack>
  );
}

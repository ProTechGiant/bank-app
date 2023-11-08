import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { TriangleIcon } from "../assets/icons";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { GoalGetterProductResponse } from "../types";

interface RiskTypeInterface {
  bestMatchRisk: number;
  selectedRisk: number | undefined;
  data: GoalGetterProductResponse;
  onRiskPress: (id: number) => void;
}

export default function RiskType({ onRiskPress, data, selectedRisk, bestMatchRisk }: RiskTypeInterface) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState } = useGoalGetterContext();

  const riskIconLookUp = {
    "NO RISK": require("../assets/noRisk.png"),
    "LOW RISK": require("../assets/lowRisk.png"),
    "MEDIUM RISK": require("../assets/mediumRisk.png"),
    "HIGH RISK": require("../assets/highRisk.png"),
  };

  const boxContainer = useThemeStyles<ViewStyle>(theme => ({
    margin: theme.spacing["20p"],
    gap: theme.spacing["12p"],
  }));

  const riskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-30"],
    borderRadius: theme.radii.small,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing["4p"],
  }));

  const selectedRiskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase+30"],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
  }));

  const bestMatchContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: "#7DF9DD",
    padding: theme.spacing["4p"],
    borderRadius: theme.radii.small,
  }));

  return (
    <Stack direction="vertical" style={boxContainer}>
      <Stack direction="horizontal" align="center" gap="8p">
        <Typography.Text size="title1" weight="bold">
          {t("GoalGetter.ShapeYourGoalScreen.riskType")}
        </Typography.Text>
        <Pressable
          onPress={() => {
            navigation.navigate("GoalGetter.RisksAppetiteScreen");
            return;
          }}>
          <InfoCircleIcon />
        </Pressable>
      </Stack>
      <Stack direction="horizontal" gap="8p">
        {data.Risks.map((risk, index) => (
          <Stack key={index} direction="vertical" align="stretch" justify="center" gap="16p" flex={1}>
            <Pressable
              key={risk.Id}
              onPress={() => {
                setGoalContextState({ RiskId: risk.Id });
                onRiskPress(risk.Id);
              }}
              style={[riskBoxContainer, selectedRisk === risk.Id && selectedRiskBoxContainer]}>
              <Stack direction="vertical" align="center" justify="center" style={iconContainer}>
                <Image source={riskIconLookUp[risk.Name]} />
              </Stack>
              <Typography.Text
                size="caption1"
                weight="bold"
                color={selectedRisk === risk.Id ? "supportBase-30" : "neutralBase+30"}>
                {risk.Name}
              </Typography.Text>
            </Pressable>
          </Stack>
        ))}
      </Stack>
      <Stack direction="horizontal" gap="8p">
        {data.Risks.map((risk, index) => (
          <Stack key={index} direction="vertical" align="stretch" justify="center" gap="16p" flex={1}>
            {risk.Id === bestMatchRisk ? (
              <Stack direction="vertical" align="center" style={bestMatchContainer}>
                <View style={styles.bestMatchBoxContainer}>
                  <TriangleIcon />
                </View>
                <Typography.Text size="caption1" weight="bold" color="neutralBase+30">
                  {t("GoalGetter.ShapeYourGoalScreen.bestMatch")}
                </Typography.Text>
              </Stack>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  bestMatchBoxContainer: {
    position: "absolute",
    transform: [{ translateY: -7 }],
  },
});

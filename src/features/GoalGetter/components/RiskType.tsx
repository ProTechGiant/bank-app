import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

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
  const { setGoalContextState, RiskId } = useGoalGetterContext();

  useEffect(() => {
    if (RiskId === undefined) {
      setGoalContextState({ RiskId: bestMatchRisk });
    }
  }, []);

  const riskIconLookUp = {
    // TODO will change when UI add the both image dark , highlighted
    "NO RISK": require("../assets/no-risk-dark.png"),
    "LOW RISK": require("../assets/lowRisk.png"),
    "MEDIUM RISK": require("../assets/mediumRisk.png"),
    "HIGH RISK": require("../assets/highRisk.png"),
  };
  const riskNameFormatter = (test: string) => {
    return test.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };
  const boxContainer = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["16p"],
    paddingBottom: theme.spacing["64p"],
  }));

  const riskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.neutralBaseHover,
    borderRadius: theme.radii.medium,
    alignItems: "center",
  }));

  const selectedRiskBoxContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-70"],
  }));

  const iconContainer = useThemeStyles<ViewStyle>(theme => ({
    width: theme.spacing["48p"],
    height: theme.spacing["48p"],
  }));

  const bestMatchContainer = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["primaryBase-70"],
    padding: theme.spacing["4p"],
    borderRadius: theme.radii.small,
    marginVertical: theme.spacing["12p"],
  }));

  const riskTypeTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginEnd: theme.spacing["12p"],
    marginVertical: theme.spacing["16p"],
  }));

  const infoIconStyle = useThemeStyles(theme => theme.palette["neutralBase-60"]);
  const riskIconTintStyle = useThemeStyles(theme => theme.palette["primaryBase-70"]);
  const defaultIconTintStyle = useThemeStyles(theme => theme.palette["neutralBase+30"]);

  const riskNameTextStyle = useThemeStyles<TextStyle>(theme => ({
    marginTop: theme.spacing["8p"],
  }));

  return (
    <Stack direction="vertical" style={boxContainer} testID="GoalGetter.GoalReviewScreen-RiskType">
      <Stack direction="horizontal" align="center">
        <Typography.Text size="title3" weight="bold" color="neutralBase-60" style={riskTypeTextStyle}>
          {t("GoalGetter.ShapeYourGoalScreen.riskType")}
        </Typography.Text>
        <Pressable
          testID="GoalGetter.GoalReviewScreen-RiskType:RisksAppetiteScreenPressable"
          onPress={() => {
            navigation.navigate("GoalGetter.RisksAppetiteScreen");
            return;
          }}>
          <InfoCircleIcon color={infoIconStyle} />
        </Pressable>
      </Stack>
      <Stack direction="horizontal" gap="8p" style={styles.riskContainerStyle}>
        {data?.Risks.map((risk, index) => (
          <Stack key={index} direction="vertical" align="center" justify="space-between">
            <Pressable
              testID={`GoalGetter.GoalReviewScreen-RiskType:${index}Pressable`}
              key={risk.Id}
              onPress={() => {
                setGoalContextState({ RiskId: risk.Id });
                onRiskPress(risk.Id);
              }}
              style={[riskBoxContainer, selectedRisk === risk.Id && selectedRiskBoxContainer]}>
              <Stack direction="vertical" align="center" justify="center" style={iconContainer}>
                <Image
                  source={riskIconLookUp[risk.Name]}
                  style={{ tintColor: RiskId === risk.Id ? defaultIconTintStyle : riskIconTintStyle }}
                />
              </Stack>
            </Pressable>
            <Typography.Text
              size="caption2"
              align="center"
              style={riskNameTextStyle}
              color={selectedRisk === risk.Id ? "primaryBase-70" : "primaryBase-70"}>
              {riskNameFormatter(risk.Name)}
            </Typography.Text>
          </Stack>
        ))}
      </Stack>
      <Stack direction="horizontal" gap="8p">
        {data?.Risks.map((risk, index) => (
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
  riskContainerStyle: {
    justifyContent: "space-between",
    width: "100%",
  },
});

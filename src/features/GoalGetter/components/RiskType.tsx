import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { InfoCircleIcon } from "@/assets/icons";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { TriangleIcon } from "../assets/icons";

export default function RiskType() {
  const { t } = useTranslation();

  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const handleBoxPress = (index: number) => {
    setSelectedBox(index);
  };

  // TODO: remove mocked data after api integrations
  const boxes = [
    { id: 1, text: "No Risk", bestMatch: true, imageUrl: require("../assets/noRisk.png") },
    { id: 2, text: "Low risk", imageUrl: require("../assets/lowRisk.png") },
    { id: 3, text: "Medium risk", imageUrl: require("../assets/mediumRisk.png") },
    { id: 4, text: "High risk", imageUrl: require("../assets/highRisk.png") },
  ];

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
        {/* TODO: add navigation here */}
        <Pressable
          onPress={() => {
            return;
          }}>
          <InfoCircleIcon />
        </Pressable>
      </Stack>
      <Stack direction="horizontal" gap="8p">
        {boxes.map((box, index) => (
          <Stack key={index} direction="vertical" align="stretch" justify="center" gap="16p" flex={1}>
            <Pressable
              key={box.id}
              onPress={() => handleBoxPress(index)}
              style={[riskBoxContainer, selectedBox === index && selectedRiskBoxContainer]}>
              <Stack direction="vertical" align="center" justify="center" style={iconContainer}>
                <Image source={box.imageUrl} />
              </Stack>
              <Typography.Text
                size="caption1"
                weight="bold"
                color={selectedBox === index ? "supportBase-30" : "neutralBase+30"}>
                {box.text}
              </Typography.Text>
            </Pressable>
          </Stack>
        ))}
      </Stack>
      <Stack direction="horizontal" gap="8p">
        {boxes.map((box, index) => (
          <Stack key={index} direction="vertical" align="stretch" justify="center" gap="16p" flex={1}>
            {box.bestMatch ? (
              <Stack direction="vertical" align="center" style={bestMatchContainer}>
                <View style={styles.bestMatchBoxContainer}>
                  <TriangleIcon />
                </View>
                {/* TODO: add translations  */}
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

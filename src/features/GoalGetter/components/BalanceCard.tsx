import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressIndicator } from "@/components";
import NavHeader from "@/components/NavHeader";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import balanceCardImage from "../assets/goal-card-background-image.png";
import { GoalEditIcon } from "../assets/icons";
import { useGoalGetterProducts } from "../hooks/query-hooks";
import RiskType from "./RiskType";

interface BalanceCardProps {
  goalAmount?: string;
  goalDuration?: string;
  updateBoxPressHandler: (id: number) => void;
}

export default function BalanceCard({ goalAmount, goalDuration, updateBoxPressHandler }: BalanceCardProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { data: goalGetterProducts } = useGoalGetterProducts("12", "6000", "850");
  const [selectedBox, setSelectedBox] = useState<number | undefined>(goalGetterProducts?.BestMatchRisk);

  const handleBoxPress = (id: number) => {
    setSelectedBox(id);
    updateBoxPressHandler(id);
  };

  const insets = useSafeAreaInsets();
  const balanceCardContainer = useThemeStyles<ViewStyle>(() => ({
    position: "relative",
    height: Platform.OS === "android" ? "30%" : "30%" + insets.top,
  }));

  const handleOnEditPress = () => {
    navigation.navigate("GoalGetter.ShapeGoalScreen");
  };

  const balanceAmountContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    paddingVertical: theme.spacing["12p"],
  }));

  const balanceDurationContainer = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["12p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={balanceCardContainer}>
      <ImageBackground source={balanceCardImage} style={styles.cardBackground} resizeMode="stretch">
        <SafeAreaView edges={["top"]} />
        <NavHeader
          variant="white"
          withBackButton={false}
          title={
            <View style={styles.progressBarStyle}>
              <ProgressIndicator currentStep={2} totalStep={5} />
            </View>
          }
          end={
            <NavHeader.CloseEndButton
              hasBackground={false}
              color="supportBase-30"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <Stack direction="horizontal" align="center" justify="space-between" style={balanceAmountContainer}>
          <Stack direction="vertical">
            <Typography.Text size="footnote" color="neutralBase-30">
              {t("GoalGetter.ShapeYourGoalScreen.goalAmount")}
            </Typography.Text>
            <Typography.Text size="xlarge" color="neutralBase-60" weight="bold">
              {goalAmount}
            </Typography.Text>
          </Stack>
          <Stack direction="vertical">
            <Pressable onPress={handleOnEditPress}>
              <GoalEditIcon />
            </Pressable>
          </Stack>
        </Stack>
        <Stack direction="horizontal" align="center" style={balanceDurationContainer}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text size="footnote" color="neutralBase-30">
              {t("GoalGetter.ShapeYourGoalScreen.goalDuration")}
            </Typography.Text>
            <Typography.Text size="footnote" color="neutralBase-60" weight="bold">
              {goalDuration}
            </Typography.Text>
          </Stack>
        </Stack>
        <RiskType
          selectedRisk={selectedBox || goalGetterProducts?.BestMatchRisk}
          onRiskPress={handleBoxPress}
          data={goalGetterProducts}
          bestMatchRisk={goalGetterProducts?.BestMatchRisk}
        />
      </ImageBackground>
    </Stack>
  );
}

const styles = StyleSheet.create({
  cardBackground: {
    height: "100%",
    width: "100%",
  },
  progressBarStyle: {
    width: "100%",
  },
});

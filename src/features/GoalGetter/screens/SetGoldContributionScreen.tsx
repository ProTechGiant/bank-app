import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import * as yup from "yup";

import { ProgressIndicator, Stack, Typography } from "@/components";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import { AmountInput } from "@/components/Input";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import { useThemeStyles } from "@/theme";

import { InfoBoxIcon } from "../assets/icons";

interface GoldWeightInput {
  goldWeight: number;
}

export default function SetGoldContributionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        goldWeight: yup.number().moreThan(4),
      }),
    [t]
  );

  const { control, handleSubmit, formState, watch } = useForm<GoldWeightInput>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      goldWeight: 0,
    },
  });

  const goldWeight = watch("goldWeight");

  const handleOnClosePress = () => {
    navigation.goBack();
    return;
  };

  const handleOnContinuePress = (_value: GoldWeightInput) => {
    //TODO will use Value with context API
    navigation.navigate("GoalGetter.CreateGoalScreen");
    return;
  };

  const handleConvertValue = () => {
    // TODO: replace with value from api to get gold price
    const convertedValue = goldWeight * 24;
    return convertedValue.toLocaleString("en-US");
  };
  const handleOnSkip = () => {
    navigation.navigate("GoalGetter.CreateGoalScreen");
  };
  const errorAlertContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    // TODO: change color with new design system
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette["secondary_pinkBase-30"],
    flexGrow: 0,
  }));

  const boxInfoContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    // TODO: change color with new design system
    borderRadius: theme.radii.small,
    backgroundColor: theme.palette["supportBase-20"],
    borderStartWidth: theme.spacing["4p"],
    borderStartColor: theme.palette["errorBase-10"],
    flexGrow: 0,
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        variant="background"
        title={t("GoalGetter.ShapeYourGoalScreen.shapeYourGoal")}
        end={<NavHeader.CloseEndButton onPress={handleOnClosePress} />}
      />
      <ContentContainer style={styles.progressIndicatorContainer}>
        <ProgressIndicator currentStep={3} totalStep={5} />
      </ContentContainer>
      <ScrollView style={styles.contentContainerStyle} contentContainerStyle={styles.contentContainerStyle}>
        <ContentContainer>
          <Stack direction="vertical" align="stretch" gap="24p" flex={1}>
            <Stack direction="vertical" gap="4p">
              <Typography.Text color="neutralBase+30" size="title1" weight="bold">
                {t("GoalGetter.SetGoldContributionScreen.setUpContribution")}
              </Typography.Text>
              <Typography.Text color="neutralBase+30" size="callout">
                {t("GoalGetter.SetGoldContributionScreen.initialAmount")}
              </Typography.Text>
            </Stack>
            <Stack direction="vertical">
              <AmountInput
                control={control}
                currentBalance={0}
                maxLength={5}
                name="goldWeight"
                AmountType={t("GoalGetter.SetGoldContributionScreen.grams")}
                inputColor="neutralBase+30"
                showConvertedBalance={false}
              />
              <Stack direction="vertical" gap="4p">
                <Typography.Text color="neutralBase+30" size="callout">
                  {t("GoalGetter.SetGoldContributionScreen.convertedAmount")}
                </Typography.Text>
                <Typography.Text color="neutralBase+30" size="callout">
                  {t("GoalGetter.SetGoldContributionScreen.sar", { value: handleConvertValue() })}
                </Typography.Text>
              </Stack>
            </Stack>
            {formState.errors.goldWeight ? (
              <ContentContainer style={errorAlertContainerStyle}>
                <Typography.Text color="complimentBase+20" size="footnote">
                  {t("GoalGetter.SetGoldContributionScreen.minimumGrams")}
                </Typography.Text>
              </ContentContainer>
            ) : null}
            <ContentContainer style={boxInfoContainerStyle}>
              <Stack direction="horizontal" gap="8p">
                <InfoBoxIcon />
                <Stack direction="vertical">
                  <Typography.Text color="neutralBase+20" size="caption1">
                    {t("GoalGetter.SetGoldContributionScreen.pleaseNote")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+20" size="caption1">
                    {t("GoalGetter.SetGoldContributionScreen.minimumGramsInfo")}
                  </Typography.Text>
                  <Typography.Text color="neutralBase+20" size="caption1">
                    {t("GoalGetter.SetGoldContributionScreen.setUpLaterInfo")}
                  </Typography.Text>
                </Stack>
              </Stack>
            </ContentContainer>
            <Stack direction="vertical" gap="8p" align="stretch" justify="flex-end" flex={1}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnContinuePress)}>
                {t("GoalGetter.SetGoldContributionScreen.continue")}
              </SubmitButton>
              <Button onPress={handleOnSkip} variant="tertiary">
                {t("GoalGetter.SetGoldContributionScreen.skipForNow")}
              </Button>
            </Stack>
          </Stack>
        </ContentContainer>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: { flex: 1 },
  progressIndicatorContainer: { flexGrow: 0 },
});

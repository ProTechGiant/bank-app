import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import { QuestionIcon } from "@/assets/icons";
import ContentContainer from "@/components/ContentContainer";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import Modal from "@/components/Modal";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import useThemeStyles from "@/theme/use-theme-styles";
import { alphaNumericSpaceRegExp } from "@/utils";

import { CreateGoalInput } from "../../types";
import ToggleCard from "./ToggleCard";
import ToggleCardGroup from "./ToggleCardGroup";
import useCreateGoal from "./use-create-goal";
import useIsRoundupActive from "./use-roundup-active";

export default function CreateGoalScreen() {
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const createGoalAsync = useCreateGoal();
  const { data } = useIsRoundupActive();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        GoalName: Yup.string()
          .required(t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .matches(alphaNumericSpaceRegExp, t("SavingsGoals.CreateGoalScreen.form.name.validation.invalid")),
        GoalAmount: Yup.number()
          .required(t("SavingsGoals.CreateGoalScreen.form.amount.validation.required"))
          .min(0.01, t("SavingsGoals.CreateGoalScreen.form.name.validation.required"))
          .max(9999999999.99, t("SavingsGoals.CreateGoalScreen.form.amount.validation.invalid")),
        TargetDate: Yup.date().required(t("SavingsGoals.CreateGoalScreen.form.amount.validation.required")),
      }),
    [i18n.language]
  );

  const { control, handleSubmit, watch, setValue } = useForm<CreateGoalInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      IsNotificationActive: false,
      IsRoundupActive: false,
    },
  });

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const isRoundupActive = watch("IsRoundupActive");

  useEffect(() => {
    if (!isRoundupActive) return;
    if (false === data?.IsRoundUpActive) return;

    Alert.alert(
      t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.title"),
      t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.message"),
      [
        {
          text: t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.dontSwitch"),
          onPress: () => setValue("IsRoundupActive", false),
        },
        { text: t("SavingsGoals.CreateGoalScreen.roundUpsAlreadyActiveAlert.switch"), style: "default" },
      ]
    );
  }, [isRoundupActive]);

  // commented out for now while api issues are being resolved
  const handleOnSubmit = async (values: CreateGoalInput) => {
    try {
      const response = await createGoalAsync.mutateAsync(values);

      navigation.navigate("SavingsGoals.GoalDetailsScreen", {
        SavingsPotId: response.SavingsPotId,
        redirectToFundingModal: true,
      });
    } catch (error) {
      Alert.alert(t("errors.generic.title"), t("errors.generic.message"), [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

      __DEV__ && console.error("Could not submit saving goal details: ", error);
    }
  };

  const handleOnModalClose = () => {
    setIsInfoModalVisible(false);
  };

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: "auto",
    marginBottom: theme.spacing["20p"],
  }));

  const formContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["24p"],
  }));

  const iconStyle = useThemeStyles<ViewStyle>(theme => ({
    marginRight: theme.spacing["4p"],
  }));

  const questionDimensions = useThemeStyles<number>(theme => theme.iconDimensions.createGoal.question, []);
  const questionIconColor = useThemeStyles<string>(theme => theme.palette["primaryBase"], []);

  return (
    <SafeAreaProvider>
      <Page>
        <NavHeader withBackButton />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ContentContainer>
            <View style={formContainerStyle}>
              <Typography.Text size="large" weight="bold" style={titleStyle}>
                {t("SavingsGoals.CreateGoalScreen.title")}
              </Typography.Text>
              <Stack direction="vertical" align="stretch" gap="24p">
                <TextInput
                  control={control}
                  label={t("SavingsGoals.CreateGoalScreen.form.name.label")}
                  name="GoalName"
                  placeholder={t("SavingsGoals.CreateGoalScreen.form.name.placeholder")}
                  maxLength={50}
                />
                <CurrencyInput
                  control={control}
                  label={t("SavingsGoals.CreateGoalScreen.form.amount.label")}
                  name="GoalAmount"
                  placeholder={t("SavingsGoals.CreateGoalScreen.form.amount.placeholder")}
                  maxLength={16} // 10 digits and 2 decimals
                />
                <DatePickerInput
                  control={control}
                  placeholder={t("SavingsGoals.CreateGoalScreen.form.targetDate.openDatePickerButton")}
                  headerText={t("SavingsGoals.CreateGoalScreen.form.targetDate.headerText")}
                  label={t("SavingsGoals.CreateGoalScreen.form.targetDate.label")}
                  name="TargetDate"
                  buttonText={t("SavingsGoals.CreateGoalScreen.form.targetDate.datePickerButton")}
                  minimumDate={new Date()}
                  helperText={currentValue => {
                    return differenceInDays(currentValue, new Date()) < 31
                      ? t("SavingsGoals.CreateGoalScreen.form.targetDate.helperText")
                      : undefined;
                  }}
                />
                <ToggleCardGroup>
                  <ToggleCard
                    name="IsRoundupActive"
                    label={t("SavingsGoals.CreateGoalScreen.form.roundUps.label")}
                    helperText={t("SavingsGoals.CreateGoalScreen.form.roundUps.helperText")}
                    onInfoPress={() => setIsInfoModalVisible(true)}
                    control={control}
                  />
                  <ToggleCard
                    name="IsNotificationActive"
                    label={t("SavingsGoals.CreateGoalScreen.form.notification.label")}
                    helperText={t("SavingsGoals.CreateGoalScreen.form.notification.helperText")}
                    control={control}
                  />
                </ToggleCardGroup>
              </Stack>
            </View>
            <View style={buttonContainerStyle}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("SavingsGoals.CreateGoalScreen.button")}
              </SubmitButton>
            </View>
          </ContentContainer>
        </ScrollView>
      </Page>
      <Modal visible={isInfoModalVisible} onClose={handleOnModalClose}>
        <View style={contentContainerStyle}>
          <Stack direction="vertical" gap="8p">
            <Typography.Text color="primaryBase+30" size="title2" weight="bold">
              {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.title")}
            </Typography.Text>
            <Typography.Text color="primaryBase+30" size="callout">
              {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.content")}
            </Typography.Text>
            <Pressable
              style={styles.iconLink}
              onPress={() => {
                Alert.alert("FAQ Page is coming soon!");
              }}>
              <View style={iconStyle}>
                <QuestionIcon height={questionDimensions} width={questionDimensions} color={questionIconColor} />
              </View>
              <Typography.Text color="primaryBase" size="footnote">
                {t("SavingsGoals.CreateGoalScreen.aboutRoundUpsPanel.smallText")}
              </Typography.Text>
            </Pressable>
          </Stack>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconLink: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
});

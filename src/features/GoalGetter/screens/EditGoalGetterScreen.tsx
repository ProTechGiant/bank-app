import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import CurrencyInput from "@/components/Form/CurrencyInput";
import DatePickerInput from "@/components/Form/DatePickerInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface EditGoalGetter {
  GoalName: string;
  TargetAmount: number;
  InitialContribution: string;
  MonthlyContribution: number;
  UpcomingContribution: Date;
  StartDate: string;
  EndDate: Date;
}

export default function EditGoalGetterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const handleOnSubmitEditGoalGetter = () => {
    //TODO: Handle onSubmit Edit Goal Getter
  };

  const validationSchema = yup.object().shape({
    GoalName: yup
      .string()
      .required(t("GoalGetter.CreateGoalGetter.validationError.required"))
      .max(50, t("GoalGetter.CreateGoalGetter.validationError.maximum")),
    //TODO : Validate the others textinputs after getting the API
  });

  const { control, handleSubmit, setValue } = useForm<EditGoalGetter>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      //TODO : These default values will be replaced with the values coming from API
      GoalName: "Phone",
      TargetAmount: 12000,
      InitialContribution: "500 SAR",
      MonthlyContribution: 1800,
      StartDate: "12 Jan, 2023",
    },
  });

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["20p"],
  }));

  const headerText = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const submitButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["20p"],
    paddingBottom: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <NavHeader
          onBackPress={handleOnBackPress}
          withBackButton={true}
          // TODO : Goal name will be replaced with Goal Name that coming from API
          title="Goal Name"
          end={<NavHeader.CloseEndButton onPress={handleOnBackPress} />}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Stack direction="vertical" align="stretch" style={contentStyle}>
            <View style={headerText}>
              <Typography.Text size="title1" weight="medium">
                {t("GoalGetter.EditGoalGetter.label")}
              </Typography.Text>
            </View>
            <Stack direction="vertical" align="stretch" gap="12p">
              <TextInput
                name="GoalName"
                control={control}
                onClear={() => setValue("GoalName", "")}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.goalName")}
              />
              <CurrencyInput
                name="TargetAmount"
                control={control}
                onClear={() => setValue("TargetAmount", 0)}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.targetAmount")}
              />
              <TextInput
                focusable={true}
                name="InitialContribution"
                control={control}
                onClear={() => setValue("InitialContribution", "")}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.initialContribution")}
                isEditable={false}
              />
              <CurrencyInput
                name="MonthlyContribution"
                control={control}
                currency=""
                onClear={() => setValue("MonthlyContribution", 0)}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.monthlyContribuition")}
              />
              <DatePickerInput
                buttonText={t("GoalGetter.EditGoalGetter.DateModal.headerText")}
                headerText={t("GoalGetter.EditGoalGetter.DateModal.selectButton")}
                name="UpcomingContribution"
                control={control}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.upcomingContribution")}
                placeholder={t("GoalGetter.EditGoalGetter.DateModal.headerText")}
                minimumDate={new Date()}
              />
              <TextInput
                name="StartDate"
                isEditable={false}
                control={control}
                onClear={() => setValue("StartDate", "")}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.startDate")}
              />
              <DatePickerInput
                buttonText={t("GoalGetter.EditGoalGetter.DateModal.headerText")}
                headerText={t("GoalGetter.EditGoalGetter.DateModal.selectButton")}
                name="EndDate"
                control={control}
                label={t("GoalGetter.EditGoalGetter.InputsLabels.upcomingContribution")}
                placeholder={t("GoalGetter.EditGoalGetter.DateModal.headerText")}
                minimumDate={new Date()}
              />
            </Stack>
          </Stack>
        </ScrollView>
        <View style={submitButtonStyle}>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmitEditGoalGetter)}>
            {t("GoalGetter.EditGoalGetter.ButtonsText.confirmChanges")}
          </SubmitButton>
          <Button variant="tertiary" onPress={handleOnBackPress}>
            {t("GoalGetter.EditGoalGetter.ButtonsText.cancel")}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}

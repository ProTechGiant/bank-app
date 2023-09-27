import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as yup from "yup";

import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Pill from "@/components/Pill";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import GoalGetterHeader from "../components/GoalGetterHeader";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { suggestedGoalNames } from "../mocks/suggestedGoalNames";

interface GoalNameInput {
  GoalName: string;
}

export default function CreateGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { goalImage, setGoalContextState } = useGoalGetterContext();

  const validationSchema = yup.object().shape({
    GoalName: yup
      .string()
      .required(t("GoalGetter.CreateGoalGetter.validationError.required"))
      .max(50, t("GoalGetter.CreateGoalGetter.validationError.maximum"))
      .min(5, t("GoalGetter.CreateGoalGetter.validationError.minimum")),
  });

  const { control, handleSubmit, setValue, watch } = useForm<GoalNameInput>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const goalNameValue = watch("GoalName");

  const handleSuggestedNamesPress = (purchase: string) => {
    setValue("GoalName", purchase, { shouldValidate: true, shouldDirty: true });
  };

  const handleOpenImagePicker = () => {
    navigation.navigate("GoalGetter.ImageGallary");
  };

  const handleOnSubmit = async (data: GoalNameInput) => {
    setGoalContextState({ goalName: data.GoalName });
    navigation.navigate("GoalGetter.TargetAmountScreen");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    paddingTop: theme.spacing["24p"],
    backgroundColor: theme.palette["neutralBase-60"],
    flex: 1,
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["12p"],
    marginHorizontal: theme.spacing["12p"],
    flex: 1,
  }));

  const suggestNamesStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing["12p"],
    marginBottom: theme.spacing["32p"],
  }));

  const submitButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["12p"],
    marginBottom: theme.spacing["12p"],
  }));

  return (
    <View style={containerStyle}>
      <NavHeader
        title={
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={5} />
          </View>
        }
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <GoalGetterHeader imageURL={goalImage} handleChangeImage={handleOpenImagePicker} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={contentStyle}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <TextInput
              name="GoalName"
              control={control}
              showCharacterCount={true}
              maxLength={50}
              label={t("GoalGetter.CreateGoalGetter.inputLabel")}
              extraStart={t("GoalGetter.CreateGoalGetter.extraStart")}
            />
            <Typography.Text size="callout" weight="medium">
              {t("GoalGetter.CreateGoalGetter.suggestedNames")}
            </Typography.Text>
            <View style={suggestNamesStyle}>
              {suggestedGoalNames.map(item => (
                <Pill
                  key={item.value}
                  isActive={item.value === goalNameValue}
                  onPress={() => handleSuggestedNamesPress(item.value)}>
                  {item.label}
                </Pill>
              ))}
            </View>
          </Stack>
        </ScrollView>
        <View style={submitButtonStyle}>
          <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
            {t("GoalGetter.CreateGoalGetter.continueButton")}
          </SubmitButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  progressIndicator: { width: "80%" },
});

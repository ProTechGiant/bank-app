import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Chip from "@/components/Chip";
import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Pill from "@/components/Pill";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { PhotoInput } from "../components/PhotoInput";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { usePredefined } from "../hooks/query-hooks";
import { tags } from "./mock";

interface GoalNameInput {
  GoalName: string;
}

export default function CreateGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState, predefinedGoalId } = useGoalGetterContext();
  const { data } = usePredefined("name", predefinedGoalId);

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

  const handleOnPredefinedPress = () => {
    navigation.navigate("GoalGetter.ImageGallary");
  };

  const handleOnSubmit = (formData: GoalNameInput) => {
    setGoalContextState({ goalName: formData.GoalName });
    navigation.navigate("GoalGetter.TargetAmountScreen");
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
    paddingTop: theme.spacing["32p"],
    backgroundColor: theme.palette["neutralBase-60"],
    flex: 1,
  }));

  const suggestNamesStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing["12p"],
    marginBottom: theme.spacing["32p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    marginVertical: theme.spacing["16p"],
  }));

  const submitButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["32p"],
  }));

  const progressIndicatorColor = useThemeStyles(theme => theme.palette.secondary_mintBase);

  const tagsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    marginVertical: theme.spacing["16p"],
    flexWrap: "wrap",
  }));

  const handleUploadPhoto = () => {
    // TODO will be integrated with Api once finished
  };

  return (
    <View style={containerStyle}>
      <NavHeader
        title={t("GoalGetter.CreateGoalGetter.photoInput.buttons.predefinedPhoto")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer isScrollView={true}>
        <Stack direction="horizontal" style={styles.progressIndicator}>
          <ProgressIndicator currentStep={1} totalStep={5} color={progressIndicatorColor} />
        </Stack>
        <KeyboardAvoidingView style={contentContainerStyle} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <TextInput
              name="GoalName"
              control={control}
              showCharacterCount={true}
              maxLength={50}
              label={t("GoalGetter.CreateGoalGetter.inputLabel")}
              extraStart={t("GoalGetter.CreateGoalGetter.extraStart")}
            />
            {data?.Predefined ? (
              <>
                <Typography.Text size="callout" weight="medium">
                  {t("GoalGetter.CreateGoalGetter.suggestedNames")}
                </Typography.Text>
                <View style={suggestNamesStyle}>
                  {data.Predefined.map(item => (
                    <Pill
                      key={item.Id}
                      isActive={item.Name === goalNameValue}
                      onPress={() => handleSuggestedNamesPress(item.Name)}>
                      {item.Name}
                    </Pill>
                  ))}
                </View>
              </>
            ) : null}
          </Stack>
          {/* TODO will be integrated after api finished */}
          <Stack direction="horizontal" gap="12p" style={tagsContainerStyle}>
            {tags.map((item, itemIndex) => {
              return (
                <Chip
                  onPress={() => {
                    // TODO will be integrated after api finished
                  }}
                  title={item}
                  isRemovable={false}
                  key={itemIndex}
                  isSelected={false}
                />
              );
            })}
          </Stack>
          <PhotoInput onChange={handleUploadPhoto} handleOnPredefinedPress={handleOnPredefinedPress} />
          <View style={submitButtonStyle}>
            <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
              {t("GoalGetter.CreateGoalGetter.continueButton")}
            </SubmitButton>
          </View>
        </KeyboardAvoidingView>
      </ContentContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  progressIndicator: { width: "100%" },
});

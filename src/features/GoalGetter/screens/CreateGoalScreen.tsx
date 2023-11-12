import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Pill from "@/components/Pill";
import ProgressIndicator from "@/components/ProgressIndicator";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useGoalImagesContent, useGoalNamesContent } from "@/hooks/use-content";
import { useThemeStyles } from "@/theme";

import { PhotoInput } from "../components/PhotoInput";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalsDetails } from "../hooks/query-hooks";

interface GoalNameInput {
  GoalName: string;
}

export default function CreateGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { setGoalContextState } = useGoalGetterContext();
  const { data: detailsData } = useGoalsDetails();
  const { data: goalsNamesData } = useGoalNamesContent(detailsData?.GoalNamesURL);
  const { data: goalsImagesData } = useGoalImagesContent(detailsData?.GoalImagesURL);

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
    navigation.navigate("GoalGetter.ImageGallary", {
      images: goalsImagesData,
    });
  };

  const handleUploadPhoto = _data => {
    // TODO will be integrated with Api once finished
  };

  const handleOnSkip = () => {
    navigation.navigate("GoalGetter.ReviewGoalScreen");
  };

  const handleOnSubmit = (formData: GoalNameInput) => {
    setGoalContextState({ GoalName: formData.GoalName });
    navigation.navigate("GoalGetter.ReviewGoalScreen");
  };

  const suggestNamesStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing["12p"],
    marginBottom: theme.spacing["32p"],
  }));

  const contentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["16p"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["64p"],
  }));

  const progressIndicatorColor = useThemeStyles(theme => theme.palette.secondary_mintBase);

  const primaryButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing["20p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60">
      <NavHeader
        title={t("GoalGetter.CreateGoalGetter.photoInput.buttons.predefinedPhoto")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer isScrollView={true}>
        <Stack direction="horizontal" style={styles.progressIndicator}>
          <ProgressIndicator currentStep={4} totalStep={5} color={progressIndicatorColor} />
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
            {goalsNamesData?.length ? (
              <>
                <Typography.Text size="callout" weight="medium">
                  {t("GoalGetter.CreateGoalGetter.suggestedNames")}
                </Typography.Text>
                <View style={suggestNamesStyle}>
                  {goalsNamesData.map(item => (
                    <Pill
                      key={item.ContentId}
                      isActive={item.Title === goalNameValue}
                      onPress={() => handleSuggestedNamesPress(item.Title)}>
                      {item.Title}
                    </Pill>
                  ))}
                </View>
              </>
            ) : null}
          </Stack>
          <PhotoInput onChange={handleUploadPhoto} handleOnPredefinedPress={handleOnPredefinedPress} />
          <View style={buttonsContainerStyle}>
            <View style={primaryButtonStyle}>
              <Button disabled={false} onPress={handleSubmit(handleOnSubmit)}>
                {t("GoalGetter.CreateGoalGetter.continueButton")}
              </Button>
            </View>
            <View style={primaryButtonStyle}>
              <Button onPress={handleOnSkip} variant="tertiary">
                {t("GoalGetter.CreateGoalGetter.skipNow")}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  progressIndicator: { width: "100%" },
});

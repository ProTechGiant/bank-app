import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
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
import { useToasts } from "@/contexts/ToastsContext";
import { useGoalImagesContent, useGoalNamesContent } from "@/hooks/use-content";
import { useThemeStyles } from "@/theme";

import { PhotoInput } from "../components/PhotoInput";
import { useGoalGetterContext } from "../contexts/GoalGetterContext";
import { useGoalsDetails, useProductDefaults } from "../hooks/query-hooks";

interface GoalNameInput {
  GoalName: string;
}

export default function CreateGoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const addToast = useToasts();
  const { setGoalContextState, GoalImage, UploadGoalImage, GoalName } = useGoalGetterContext();
  const { data: detailsData } = useGoalsDetails();
  const { data: goalsNamesData } = useGoalNamesContent(detailsData?.GoalNamesURL);
  const { data: goalsImagesData } = useGoalImagesContent(detailsData?.GoalImagesURL);
  const { data: productDefaults } = useProductDefaults();

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

  const handleUploadPhoto = data => {
    setGoalContextState({ UploadGoalImage: data.base64 });
  };

  const handleOnSkip = () => {
    if (!GoalName) {
      setGoalContextState({
        GoalName: productDefaults?.DefaultGoalName,
        GoalImage: productDefaults?.DefaultGoalImageURL,
      });
    }
    navigation.navigate("GoalGetter.ReviewGoalScreen");
  };

  const handleOnSubmit = (formData: GoalNameInput) => {
    if (!GoalImage && !UploadGoalImage) {
      addToast({
        variant: "negative",
        message: t("GoalGetter.CreateGoalGetter.validateImageMessage"),
        position: "top",
      });
    } else {
      setGoalContextState({ GoalName: formData.GoalName });
      navigation.navigate("GoalGetter.ReviewGoalScreen");
    }
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

  const subTitleMarginBottom = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Page backgroundColor="neutralBase-60" testID="GoalGetter.CreateGoalScreen:Page">
      <NavHeader
        testID="GoalGetter.CreateGoalScreen:NavHeader"
        title={t("GoalGetter.ShapeYourGoalScreen.shapeYourGoal")}
        end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />}
      />
      <ContentContainer isScrollView={true} testID="GoalGetter.CreateGoalScreen:ContentContainer">
        <Stack direction="horizontal" style={styles.progressIndicator}>
          <ProgressIndicator currentStep={4} totalStep={5} color={progressIndicatorColor} />
        </Stack>
        <KeyboardAvoidingView
          style={contentContainerStyle}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          testID="GoalGetter.CreateGoalScreen:KeyboardAvoidingView">
          <Stack direction="vertical" gap="24p" align="stretch">
            <Stack direction="vertical" gap="8p">
              <Typography.Text color="primaryBase" size="title1" weight="bold">
                {t("GoalGetter.CreateGoalGetter.photoInput.title")}
              </Typography.Text>
              <Typography.Text style={subTitleMarginBottom} size="callout">
                {t("GoalGetter.CreateGoalGetter.photoInput.subTitle")}
              </Typography.Text>
            </Stack>
            <TextInput
              name="GoalName"
              control={control}
              showCharacterCount={true}
              maxLength={50}
              label={t("GoalGetter.CreateGoalGetter.inputLabel")}
              extraStart={t("GoalGetter.CreateGoalGetter.extraStart")}
              testID="GoalGetter.CreateGoalScreen:TextInput"
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
              <Button
                disabled={false}
                onPress={handleSubmit(handleOnSubmit)}
                testID="GoalGetter.CreateGoalScreen:continueButton">
                {t("GoalGetter.CreateGoalGetter.continueButton")}
              </Button>
            </View>
            <View style={primaryButtonStyle}>
              <Button onPress={handleOnSkip} variant="tertiary" testID="GoalGetter.CreateGoalScreen:skipNowButton">
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

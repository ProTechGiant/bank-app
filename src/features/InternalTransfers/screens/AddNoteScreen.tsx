import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import InfoBox from "@/components/InfoBox";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { emojiRegExp, emojiSpaceAlphanumericQuoteRegExp } from "@/utils";

import { SubmitNoteButton } from "../components";
import { InternalTransfersStackParams } from "../InternalTransfersStack";
import { FORBIDDEN_WORDS } from "../mocks/mockForbiddenWords";
import { Note } from "../types";

export default function AddNoteScreen() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<InternalTransfersStackParams, "InternalTransfers.AddNoteScreen">>();
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOnSubmit = (value: Note) => {
    route.params.updateNote({ content: value.content, attachment: "" });
    navigation.goBack();
  };

  const validationSchema = useMemo(
    () =>
      Yup.object({
        content: Yup.string()
          .test("is-emojis-and-regex-valid", t("InternalTransfers.AddNoteScreen.onlyFiveEmojisAllowed"), value => {
            const emojiMatchesLength = value ? (value.match(emojiRegExp) || []).length < 27 : true;
            return emojiMatchesLength;
          })
          .max(49, t("InternalTransfers.AddNoteScreen.maxCharactersReached"))
          .matches(emojiSpaceAlphanumericQuoteRegExp, t("InternalTransfers.AddNoteScreen.required")),
      }).transform((originalValue, originalObject) => {
        // If the length is zero, skip the validation part
        if (originalObject.content && originalObject.content.length === 0) {
          return Yup.string();
        }
        return originalValue;
      }),
    [t]
  );

  const { control, handleSubmit, trigger, setValue, formState } = useForm<Note>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      content: route.params.note.content,
    },
  });

  const [isContentTouched, setIsContentTouched] = useState(false);

  useEffect(() => {
    if (isContentTouched) {
      trigger("content");
    }
  }, [isContentTouched, trigger]);

  const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValue("content", e.nativeEvent.text);
    setIsContentTouched(true);
  };

  const handleOnClear = () => {
    setValue("content", "");
    setIsContentTouched(true);
    if (!formState.isDirty) {
      setValue("content", "", { shouldDirty: true });
    }
    trigger("content");
  };

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleBack} testID="InternalTransfers.AddNoteScreen:NavHeader" />
        <ContentContainer isScrollView style={styles.container}>
          <Stack direction="vertical" gap="12p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.AddNoteScreen.title")}
            </Typography.Text>
            <Typography.Text color="neutralBase+10" size="callout">
              {t("InternalTransfers.AddNoteScreen.noteInstructions")}
            </Typography.Text>
            <TextInput
              control={control}
              label={t("InternalTransfers.AddNoteScreen.placeholder")}
              name="content"
              maxLength={50}
              multiline
              numberOfLines={3}
              autoCorrect={false}
              showCharacterCount
              testID="InternalTransfers.AddNoteScreen:ContentInput"
              onBlur={() => setIsContentTouched(true)}
              onChange={e => handleInputChange(e)}
              onClear={handleOnClear}
            />
            <InfoBox variant="primary" borderPosition="start">
              {t("InternalTransfers.AddNoteScreen.noSpecialCharacters")}
            </InfoBox>
          </Stack>
          <View>
            <View style={buttonContainerStyle}>
              <SubmitNoteButton
                control={control}
                name="content"
                onSubmit={handleSubmit(handleOnSubmit)}
                forbiddenWords={FORBIDDEN_WORDS}
                testID="InternalTransfers.AddNoteScreen:SubmitButton">
                {t("InternalTransfers.AddNoteScreen.done")}
              </SubmitNoteButton>
            </View>
          </View>
        </ContentContainer>
      </Page>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
});

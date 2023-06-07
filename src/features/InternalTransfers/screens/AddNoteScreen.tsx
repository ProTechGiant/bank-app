import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { alphaNumericSpaceQuoteRegExp } from "@/utils";

import { ErrorMessage, SubmitNoteButton } from "../components";
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
          .required(t("InternalTransfers.AddNoteScreen.required"))
          .matches(alphaNumericSpaceQuoteRegExp, t("InternalTransfers.AddNoteScreen.noSpecialCharacters")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<Note>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      content: route.params.note.content,
    },
  });

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader onBackPress={handleBack} />
        <ContentContainer isScrollView style={styles.container}>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Typography.Text color="neutralBase+30" weight="semiBold" size="title1">
              {t("InternalTransfers.AddNoteScreen.title")}
            </Typography.Text>
            <TextInput
              control={control}
              extraStart={t("InternalTransfers.AddNoteScreen.required")}
              label={t("InternalTransfers.AddNoteScreen.placeholder")}
              name="content"
              maxLength={50}
              multiline
              numberOfLines={2}
              showCharacterCount
            />
          </Stack>
          <View>
            <ErrorMessage control={control} name="content" forbiddenWords={FORBIDDEN_WORDS} />
            <View style={buttonContainerStyle}>
              <SubmitNoteButton
                control={control}
                name="content"
                onSubmit={handleSubmit(handleOnSubmit)}
                forbiddenWords={FORBIDDEN_WORDS}>
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

import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

interface BillDescriptionInput {
  BillDescription: string;
}

export default function EditBillDescriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        BillDescription: Yup.string().required(t("InternalTransfers.AddNoteScreen.required")),
      }),
    [t]
  );

  const handleOnSubmit = async (_values: BillDescriptionInput) => {
    //TODO: add API call here to update the bill description
    Alert.alert("API not integerated yet.");
  };

  const { control, handleSubmit } = useForm<BillDescriptionInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BillDescription: "",
    },
  });

  return (
    <SafeAreaProvider>
      <Page backgroundColor="neutralBase-60">
        <NavHeader end={<NavHeader.CloseEndButton onPress={() => navigation.goBack()} />} />
        <ContentContainer isScrollView style={styles.container}>
          <Stack align="stretch" direction="vertical" gap="20p">
            <Typography.Text color="neutralBase+30" weight="medium" size="title1">
              {t("SadadBillPayments.EditBillDescriptionScreen.title")}
            </Typography.Text>
            <TextInput
              control={control}
              extraStart={t("SadadBillPayments.EditBillDescriptionScreen.required")}
              label={t("SadadBillPayments.EditBillDescriptionScreen.placeholder")}
              name="BillDescription"
              maxLength={22}
              showCharacterCount
            />
          </Stack>
          <SubmitButton control={control} variant="primary" onSubmit={handleSubmit(handleOnSubmit)}>
            {t("SadadBillPayments.EditBillDescriptionScreen.saveButton")}
          </SubmitButton>
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

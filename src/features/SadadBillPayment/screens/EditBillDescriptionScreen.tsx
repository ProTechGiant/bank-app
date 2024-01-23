import { yupResolver } from "@hookform/resolvers/yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";

import { useSadadBillPaymentContext } from "../context/SadadBillPaymentContext";
import { useEditBillDescription } from "../hooks/query-hooks";
import { SadadBillPaymentStackParams } from "../SadadBillPaymentStack";

interface BillDescriptionInput {
  BillDescription: string;
}

export default function EditBillDescriptionScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SadadBillPaymentStackParams, "SadadBillPayments.EditBillDescriptionScreen">>();
  const { mutateAsync } = useEditBillDescription();

  const { billDetails, setBillDetails } = useSadadBillPaymentContext();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        BillDescription: Yup.string().required(t("SadadBillPayments.EditBillDescriptionScreen.required")),
      }),
    [t]
  );

  const handleOnSubmit = async (_values: BillDescriptionInput) => {
    const { billId } = route.params;
    try {
      await mutateAsync({
        billId: billId,
        billDescription: _values.BillDescription,
      });
      setBillDetails({ ...billDetails, Description: _values.BillDescription });
      navigation.goBack();
    } catch (err) {
      warn("SadadBill", "Could not update bill description: ", JSON.stringify(err));
    }
  };

  const { control, handleSubmit, setValue } = useForm<BillDescriptionInput>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      BillDescription: route.params.billDescription,
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
              onClear={() => setValue("BillDescription", "")}
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

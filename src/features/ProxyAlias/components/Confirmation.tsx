import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import CheckboxInput from "@/components/Form/CheckboxInput";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { useGetTermsAndConditions, useRegisterCustomer } from "../hooks/query-hooks";
import { ConfirmationInputs } from "../types";

export default function Confirmation() {
  const { t } = useTranslation();

  const { data } = useGetTermsAndConditions();

  const registerCustomerMutation = useRegisterCustomer();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const validationSchema = yup.object().shape({
    confirmed: yup.boolean().test(value => value === true),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ConfirmationInputs>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const checkBoxStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    paddingTop: theme.spacing["24p"],
  }));

  const modalCloseButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  const handleOnSubmitTermsAndConditions = async () => {
    try {
      const response = await registerCustomerMutation.mutateAsync();
      // TODO when API is ready
      console.log(response);
    } catch (error) {
      // TODO when API is ready
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Typography.Text size="title1" color="neutralBase+30" weight="medium">
          {t("ProxyAlias.AliasManagementScreen.Confirmation")}
        </Typography.Text>
        <View style={checkBoxStyle}>
          <CheckboxInput name="confirmed" control={control} />
          <Typography.Text size="footnote" color="neutralBase" weight="medium" style={styles.text}>
            {t("ProxyAlias.AliasManagementScreen.ConfirmationBody")}{" "}
            <Pressable onPress={() => setIsModalVisible(true)}>
              <Typography.Text size="footnote" color="complimentBase" style={styles.underLineText}>
                {t("ProxyAlias.AliasManagementScreen.TermsAndConditions")}
              </Typography.Text>
            </Pressable>
          </Typography.Text>
        </View>
      </View>
      <Button disabled={!isValid} onPress={handleSubmit(handleOnSubmitTermsAndConditions)}>
        {t("ProxyAlias.AliasManagementScreen.Continue")}
      </Button>
      <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)} headerText="Terms & Conditions">
        {data ? (
          <Typography.Text size="callout" color="neutralBase+10" weight="regular" style={modalCloseButtonStyle}>
            {data.TermsAndConditions}
          </Typography.Text>
        ) : (
          <View style={styles.indicatorContainerStyle}>
            <ActivityIndicator />
          </View>
        )}

        <Button onPress={() => setIsModalVisible(false)}> {t("ProxyAlias.AccountModal.Close")}</Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  indicatorContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  underLineText: {
    textDecorationLine: "underline",
  },
});

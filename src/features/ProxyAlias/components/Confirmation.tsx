import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button";
import CheckboxInput from "@/components/Form/CheckboxInput";
import Modal from "@/components/Modal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ConfirmationInputs } from "../types";

export default function Confirmation() {
  const { t } = useTranslation();

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

  const handleOnSubmitTermsAndConditions = (data: ConfirmationInputs) => {
    // TODO: when the api is ready i will call the hook here
    console.log(data);
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
              <Typography.Text size="footnote" color="primaryBase-30" style={styles.underLineText}>
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
        <Typography.Text size="callout" color="neutralBase+10" weight="regular">
          {t("ProxyAlias.AccountModal.TermsAndConditionsFirstParagraph")}
          {/* TODO this is a static i will remove it when i connct to API */}
        </Typography.Text>
        <Typography.Text>{"\n"}</Typography.Text>
        <Typography.Text size="callout" color="neutralBase+10" weight="regular" style={modalCloseButtonStyle}>
          {t("ProxyAlias.AccountModal.TermsAndConditionsSecondParagraph")}
          {/* TODO this is a static i will remove it when i connct to API */}
        </Typography.Text>
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
  text: {
    flex: 1,
  },
  underLineText: {
    textDecorationLine: "underline",
  },
});

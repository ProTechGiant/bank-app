import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, StyleSheet, View, ViewStyle } from "react-native";
import * as Yup from "yup";

import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import NotificationModal from "@/components/NotificationModal";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

import { useRegisterEmail } from "../hooks/query-hooks";

export interface Email {
  Email: string;
}

export default function RegisterEmailScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const registerEmail = useRegisterEmail();
  const [showError, setShowError] = useState<boolean>(false);

  const registerInfoLabelStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["8p"],
    marginBottom: theme.spacing["20p"],
  }));

  const reasonValidationSchema = Yup.object().shape({
    Email: Yup.string().required().email(t("ProxyAlias.RegisterEmailScreen.validationErrors.email.email")),
  });

  const { control, handleSubmit } = useForm<Email>({
    resolver: yupResolver(reasonValidationSchema),
    mode: "onBlur",
  });

  const handleRegisterEmailSuccess = () => {
    //we will handle the success case later when real api is there
    Alert.alert("Email got registered");
  };

  const handleOnSubmit = async (values: Email) => {
    registerEmail.mutate(
      { email: values.Email },
      {
        onSuccess: () => handleRegisterEmailSuccess(),
        onError: () => {
          setShowError(true);
        },
      }
    );
  };

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <Page backgroundColor="neutralBase-60" insets={["left", "right", "bottom", "top"]}>
      <NavHeader onBackPress={handleOnBackPress} />
      <ContentContainer>
        <Typography.Text size="title1" weight="semiBold">
          {t("ProxyAlias.RegisterEmailScreen.title")}
        </Typography.Text>
        {registerEmail.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <Typography.Text size="callout" style={registerInfoLabelStyle}>
              {t("ProxyAlias.RegisterEmailScreen.subTitle")}
            </Typography.Text>
            <TextInput
              control={control}
              name="Email"
              label={t("ProxyAlias.RegisterEmailScreen.emailPlaceholder")}
              showCharacterCount
            />
            <Stack direction="vertical" align="stretch" gap="4p" style={styles.buttonContainer}>
              <Button onPress={handleSubmit(handleOnSubmit)}>
                {t("ProxyAlias.RegisterEmailScreen.buttonContinue")}
              </Button>
              <Button onPress={handleOnBackPress} variant="tertiary">
                {t("ProxyAlias.RegisterEmailScreen.buttonCancel")}
              </Button>
              <NotificationModal
                variant="error"
                onClose={() => {
                  setShowError(false);
                }}
                title={t("ProxyAlias.RegisterEmailScreen.errorEmailRegistrationFailedTitle")}
                message={t("ProxyAlias.RegisterEmailScreen.errorEmailRegistrationFailedMessage")}
                isVisible={showError}
              />
            </Stack>
          </>
        )}
      </ContentContainer>
    </Page>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

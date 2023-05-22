import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as yup from "yup";

import ContentContainer from "@/components/ContentContainer";
import DropdownInput from "@/components/Form/DropdownInput";
import SubmitButton from "@/components/Form/SubmitButton";
import NotificationModal from "@/components/NotificationModal";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { LiveChatScreenHeader } from "../components";
import { OPTIONS } from "../mockOptions";

interface DropdownInputProps {
  EnquiryType: string;
}

export default function LiveChatScreen() {
  const [isError, setIsError] = useState(false);
  const { t } = useTranslation();
  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        EnquiryType: yup.string().required(t("HelpAndSupport.LiveChatScreen.error.requiredErrorMessage")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<DropdownInputProps>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      EnquiryType: undefined,
    },
  });

  const handleOnSubmit = (values: DropdownInputProps) => {
    if (values) {
      // *TODO - Open live chat
      console.log(values);
    }

    setIsError(true);
  };

  const titleContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    alignItems: "center",
    justifyContent: "center",
  }));

  const submitButtonContainer = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
    justifyContent: "flex-end",
    flex: 1,
  }));

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <LiveChatScreenHeader />
        <View style={styles.contentContainer}>
          <ContentContainer style={styles.container}>
            <View>
              <View style={titleContainer}>
                <Typography.Text color="primaryBase-10" size="title3" weight="medium">
                  {t("HelpAndSupport.LiveChatScreen.firstLineTitle")}
                </Typography.Text>
                <Typography.Text color="primaryBase-10" size="title3" weight="medium">
                  {t("HelpAndSupport.LiveChatScreen.secondLineTitle")}
                </Typography.Text>
              </View>
              <DropdownInput
                name="EnquiryType"
                control={control}
                headerText={t("HelpAndSupport.LiveChatScreen.placeholder")}
                placeholder={t("HelpAndSupport.LiveChatScreen.placeholder")}
                options={OPTIONS.map(option => ({ value: option.value, label: option.label }))}
                buttonLabel={t("HelpAndSupport.LiveChatScreen.dropdownButtonLabel")}
              />
            </View>
            <View style={submitButtonContainer}>
              <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                {t("HelpAndSupport.LiveChatScreen.submitButton")}
              </SubmitButton>
            </View>
          </ContentContainer>
        </View>
      </View>
      <NotificationModal
        title={t("HelpAndSupport.LiveChatScreen.error.title")}
        message={t("HelpAndSupport.LiveChatScreen.error.message")}
        isVisible={isError}
        variant="error"
        onClose={() => setIsError(false)}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: { flex: 2 },
});

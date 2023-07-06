import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import * as yup from "yup";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import ContextualFAQModal from "@/components/ContextualFAQModal";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { saudiPhoneRegExp } from "@/utils";

import { DetailSection, DetailSectionsContainer, HeaderWithHelpIcon } from "../components";

interface DetailInputs {
  Email: string;
  MobileNumber: string;
}

export default function ProfileDetailsScreen() {
  const { t } = useTranslation();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        // will change/add the error message with api integration
        MobileNumber: yup
          .string()
          .required(t("ProfileDetails.ProfileDetailsScreen.phoneNumber.validation.required"))
          .matches(saudiPhoneRegExp, t("ProfileDetails.ProfileDetailsScreen.phoneNumber.validation.invalid")),
        Email: yup
          .string()
          .required(t("ProfileDetails.ProfileDetailsScreen.email.validation.required"))
          .email(t("ProfileDetails.ProfileDetailsScreen.email.validation.invalid")),
      }),
    [t]
  );

  const { control, handleSubmit } = useForm<DetailInputs>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Email: "SampleXYZ@gmail.com", //TODO: use email from fetching api
      MobileNumber: "155827894", //TODO: use email from fetching api
    },
  });

  const handleOnPress = () => {
    setShowEditForm(!showEditForm);
  };

  const handleOnClose = () => {
    setShowFAQModal(false);
  };
  const handleOnPressHelp = () => {
    setShowFAQModal(true);
  };
  const handleOnSubmit = () => {
    // will be added with API integration
  };
  const handleOnCloseAlert = () => {
    // will be added with API integration
  };

  const pageStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingTop: true ? theme.spacing["16p"] : theme.spacing["24p"], // TODO: add success state for when Alert show up
    flexGrow: 1,
  }));

  const alertsStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Page insets={["top", "bottom"]}>
      {/* TODO: map values from translation object */}
      <NavHeader title={t("ProfileDetails.ProfileDetailsScreen.profileDetails")} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ContentContainer isScrollView style={pageStyles}>
          {/* {this alert will be changed with api integration and adding translations } */}
          <Stack direction="vertical" style={alertsStyles}>
            <Alert
              variant="success"
              message="Your information is updated, it can take up to 24 hours for this change to take effect."
              end={<Alert.CloseEndButton onPress={handleOnCloseAlert} />}
            />
          </Stack>
          <Stack direction="vertical" gap="24p" align="stretch">
            <Stack direction="vertical" gap="16p" align="stretch">
              <HeaderWithHelpIcon
                title={t("ProfileDetails.ProfileDetailsScreen.absherDetails")}
                onPress={handleOnPressHelp}
              />
              <DetailSectionsContainer>
                {/* TODO: map values from api with loop */}
                <DetailSection title="Name" value="Ismail Abusalah" />
                <DetailSection title="Nationality" value="Saudi" />
                <DetailSection title="KSA address" value="At Taawun, Riyadh 12475, Saudi Arabia" />
                <DetailSection title="National ID / Iqama" value="1234567890" />
                <DetailSection
                  title="ID Expiry"
                  value="31/01/2025"
                  isExpired
                  expiredDescription="Your ID is due to expire. To prevent your account being frozen, please update your ID in Absher. Once you have done this, please revisit this page and press 'Update Now'."
                  onPress={handleOnPressHelp}
                />
              </DetailSectionsContainer>
            </Stack>

            <Stack direction="vertical" gap="16p" align="stretch">
              <Typography.Text weight="medium" size="title3">
                {t("ProfileDetails.ProfileDetailsScreen.communicationDetails")}
              </Typography.Text>
              {!showEditForm ? (
                <DetailSectionsContainer showEditIcon onPress={handleOnPress}>
                  {/* TODO: map values from api */}
                  <DetailSection title="Email" value="Sample@gmail.com" />
                  <DetailSection title="Mobile Number" value="05XXXXXX" />
                </DetailSectionsContainer>
              ) : (
                <Stack direction="vertical" gap="24p" align="stretch">
                  <TextInput
                    name="Email"
                    control={control}
                    keyboardType="email-address"
                    showCharacterCount={true}
                    maxLength={30}
                    label={t("ProfileDetails.ProfileDetailsScreen.email.label")}
                    extraStart="Minimum 10 characters"
                  />
                  <PhoneNumberInput
                    control={control}
                    label={t("ProfileDetails.ProfileDetailsScreen.phoneNumber.label")}
                    name="MobileNumber"
                  />
                  <Stack direction="vertical" gap="8p" align="stretch">
                    <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)}>
                      {t("ProfileDetails.ProfileDetailsScreen.saveChanges")}
                    </SubmitButton>
                    <Button onPress={handleOnPress} variant="tertiary">
                      {t("ProfileDetails.ProfileDetailsScreen.cancel")}
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Stack>
        </ContentContainer>
      </KeyboardAvoidingView>
      {showFAQModal ? (
        <ContextualFAQModal
          visible={true}
          onClose={handleOnClose}
          title="fqa title" // TODO: change ID with api integration
          content="fqa content" // TODO: change ID with api integration
          faqId="faq_1" // TODO: change ID with api integration
        />
      ) : null}
    </Page>
  );
}

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import * as yup from "yup";

import ApiError from "@/api/ApiError";
import Alert, { AlertVariantType } from "@/components/Alert";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import ContextualFAQModal from "@/components/ContextualFAQModal";
import FlexActivityIndicator from "@/components/FlexActivityIndicator";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import NavHeader from "@/components/NavHeader";
import Page from "@/components/Page";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useOtpFlow } from "@/features/OneTimePassword/hooks/query-hooks";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { warn } from "@/logger";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";
import { emailRegex, saudiPhoneRegExp } from "@/utils";

import { DetailSection, DetailSectionsContainer, HeaderWithHelpIcon } from "../components";
import {
  UPDATE_CUSTOMER_PROFILE_OTP_REASON_CODE,
  useUpdateCustomerProfileDetails,
  useUpdateCustomerProfileIdExpiryDate,
  useUpdateCustomerProfileOTP,
} from "../hooks/query-hooks";
import { markUserAsBlocked, parseCustomerAddress, parseCustomerCivilianIDExpiryDate } from "../utils";

interface DetailInputs {
  Email: string;
  MobileNumber: string;
}

interface AlertState {
  isVisible: boolean;
  variant: AlertVariantType;
  message: string;
}

export default function ProfileDetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const otpFlow = useOtpFlow();

  const { data: customerProfile, isFetching, refetch } = useCustomerProfile();
  const { mutateAsync: UpdateCustomerProfileDetails, isLoading } = useUpdateCustomerProfileDetails();
  const { mutateAsync: UpdateCustomerProfileOTP } = useUpdateCustomerProfileOTP();
  const UpdateIdExpiryDate = useUpdateCustomerProfileIdExpiryDate();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showUpdateNowButton, setShowUpdateNowButton] = useState<boolean>(true);
  const [alertStatus, setAlertStatus] = useState<AlertState>({
    isVisible: false,
    variant: "success",
    message: "",
  });

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        MobileNumber: yup
          .string()
          .required(t("ProfileDetails.ProfileDetailsScreen.phoneNumber.validation.required"))
          .length(13, t("ProfileDetails.ProfileDetailsScreen.phoneNumber.validation.Length"))
          .matches(saudiPhoneRegExp, t("ProfileDetails.ProfileDetailsScreen.phoneNumber.validation.invalid")),
        Email: yup
          .string()
          .email(t("ProfileDetails.ProfileDetailsScreen.email.validation.invalid"))
          .matches(emailRegex, t("ProfileDetails.ProfileDetailsScreen.email.validation.invalid"))
          .required(t("ProfileDetails.ProfileDetailsScreen.email.validation.required")),
      }),
    [t]
  );

  const { control, handleSubmit, reset } = useForm<DetailInputs>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (customerProfile) {
      reset({ Email: customerProfile.Email, MobileNumber: customerProfile.MobilePhone });
    }
  }, [customerProfile, reset]);

  const handleOnPress = () => {
    setShowEditForm(!showEditForm);
    reset();
  };

  const handleOnClose = () => {
    setShowFAQModal(false);
  };

  const handleOnPressHelp = () => {
    setShowFAQModal(true);
  };

  const handleOnSubmit = async (values: DetailInputs) => {
    if (customerProfile === undefined) {
      return;
    }
    if (values.MobileNumber !== customerProfile.MobilePhone) {
      try {
        otpFlow.handle({
          action: {
            to: "ProfileDetails.ProfileDetailsScreen",
          },
          otpVerifyMethod: "customers/communication-details",
          otpOptionalParams: {
            EmailAddress: values.Email,
            MobileNumber: values.MobileNumber,
            OtpReasonCode: UPDATE_CUSTOMER_PROFILE_OTP_REASON_CODE,
          },
          onOtpRequest: () => {
            return UpdateCustomerProfileOTP({
              OtpReasonCode: UPDATE_CUSTOMER_PROFILE_OTP_REASON_CODE,
              MobileNumber: values.MobileNumber,
            });
          },
          onFinish: status => {
            refetch();
            setShowEditForm(false);
            if (status === "success") {
              if (values.Email !== customerProfile.Email) {
                setAlertStatus({
                  isVisible: true,
                  variant: "success",
                  message: t("ProfileDetails.ProfileDetailsScreen.updateDetailsSuccessMessage"),
                });
              } else {
                setAlertStatus({
                  isVisible: true,
                  variant: "success",
                  message: t("ProfileDetails.ProfileDetailsScreen.updateMobileNumberSuccessMessage"),
                });
              }
              return;
            }
            if (status === "fail") {
              setAlertStatus({
                isVisible: true,
                variant: "error",
                message: t("ProfileDetails.ProfileDetailsScreen.updateDetailsWarningMessage"),
              });
            }
          },
          onUserBlocked: async () => {
            await markUserAsBlocked();
            navigation.navigate("Passcode.ChangePasscodeStack", {
              screen: "SignIn.UserBlocked",
              params: {
                type: "otp",
                navigateTo: "ProfileDetails.ProfileDetailsScreen",
              },
            });
          },
        });
      } catch (error) {
        warn("UpdateCustomerProfileOTP=>", ` ${(error as Error).message}`);
      }
    } else {
      try {
        await UpdateCustomerProfileDetails({ EmailAddress: values.Email });
        setAlertStatus({
          isVisible: true,
          variant: "success",
          message: t("ProfileDetails.ProfileDetailsScreen.updateEmailSuccessMessage"),
        });
        setShowEditForm(false);
      } catch (error) {
        warn("UpdateCustomerProfileDetails=>", ` ${(error as Error).message}`);
      }
    }
  };

  const handleOnCloseAlert = () => {
    setAlertStatus({
      isVisible: false,
      variant: "success",
      message: "",
    });
  };

  const handleOnUpdateNowPress = async () => {
    try {
      const UpdatedCustomerProfileData = await UpdateIdExpiryDate.mutateAsync();
      if (UpdatedCustomerProfileData.IsExpired || UpdatedCustomerProfileData.ExpireSoon) {
        setShowUpdateNowButton(false);
      } else {
        setAlertStatus({
          isVisible: true,
          variant: "success",
          message: t("ProfileDetails.ProfileDetailsScreen.updateIdExpirySuccessMessage"),
        });
      }
    } catch (error) {
      setShowUpdateNowButton(false);
      if ((error as ApiError).statusCode === 408) {
        setAlertStatus({
          isVisible: true,
          variant: "error",
          message: t("ProfileDetails.ProfileDetailsScreen.updateIdExpiryTimeoutMessage"),
        });
      } else {
        setAlertStatus({
          isVisible: true,
          variant: "error",
          message: t("ProfileDetails.ProfileDetailsScreen.updateIdExpiryWarningMessage"),
        });
      }
    }
  };

  const contentContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-60"],
    paddingTop: alertStatus.isVisible ? theme.spacing["16p"] : theme.spacing["24p"],
    flexGrow: 1,
  }));

  const alertContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Page insets={["top", "bottom"]}>
      <NavHeader title={t("ProfileDetails.ProfileDetailsScreen.profileDetails")} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {customerProfile === undefined || isFetching || UpdateIdExpiryDate.isLoading ? (
          <FlexActivityIndicator />
        ) : (
          <ContentContainer isScrollView style={contentContainerStyles}>
            {alertStatus.isVisible ? (
              <Stack direction="vertical" style={alertContainerStyles}>
                <Alert
                  variant={alertStatus.variant}
                  message={alertStatus.message}
                  end={
                    alertStatus.variant === "error" ? undefined : <Alert.CloseEndButton onPress={handleOnCloseAlert} />
                  }
                />
              </Stack>
            ) : null}
            <Stack direction="vertical" gap="24p" align="stretch">
              <Stack direction="vertical" gap="16p" align="stretch">
                <HeaderWithHelpIcon
                  title={t("ProfileDetails.ProfileDetailsScreen.absherDetails")}
                  onPress={handleOnPressHelp}
                />
                <DetailSectionsContainer>
                  <DetailSection
                    title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.name")}
                    value={customerProfile.FullName}
                  />
                  <DetailSection
                    title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.nationality")}
                    value={customerProfile.NationalityCode}
                  />
                  <DetailSection
                    title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.ksaAddress")}
                    value={parseCustomerAddress(customerProfile.CustomerAddress?.Address?.[0] || {})}
                  />
                  <DetailSection
                    title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.nationalID")}
                    value={customerProfile.CivilianID}
                  />
                  <DetailSection
                    title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.idExpiry")}
                    value={parseCustomerCivilianIDExpiryDate(customerProfile.CivilianIDExpiryDate)}
                    isExpireSoon={customerProfile.ExpireSoon}
                    isUpdateNowButtonVisible={showUpdateNowButton}
                    expiredDescription={
                      showUpdateNowButton
                        ? t("ProfileDetails.ProfileDetailsScreen.expiredDescription")
                        : t("ProfileDetails.ProfileDetailsScreen.idExpiryNotUpdatedYet")
                    }
                    onPress={handleOnUpdateNowPress}
                  />
                </DetailSectionsContainer>
              </Stack>

              <Stack direction="vertical" gap="16p" align="stretch">
                <Typography.Text weight="medium" size="title3">
                  {t("ProfileDetails.ProfileDetailsScreen.communicationDetails")}
                </Typography.Text>
                {!showEditForm ? (
                  <DetailSectionsContainer showEditIcon onPress={handleOnPress}>
                    <DetailSection
                      title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.email")}
                      value={customerProfile.Email}
                    />
                    <DetailSection
                      title={t("ProfileDetails.ProfileDetailsScreen.sectionsTitle.mobileNumber")}
                      value={customerProfile.MobilePhone.replace("+966", "0")} // TODO: add logic to support dynamic country code
                    />
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
                      extraStart={t("ProfileDetails.ProfileDetailsScreen.extraStart")}
                    />
                    <PhoneNumberInput
                      control={control}
                      label={t("ProfileDetails.ProfileDetailsScreen.phoneNumber.label")}
                      name="MobileNumber"
                    />
                    <Stack direction="vertical" gap="8p" align="stretch">
                      <SubmitButton control={control} onSubmit={handleSubmit(handleOnSubmit)} loading={isLoading}>
                        {t("ProfileDetails.ProfileDetailsScreen.saveChanges")}
                      </SubmitButton>
                      <Button onPress={handleOnPress} variant="tertiary" disabled={isLoading}>
                        {t("ProfileDetails.ProfileDetailsScreen.cancel")}
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </ContentContainer>
        )}
      </KeyboardAvoidingView>
      <ContextualFAQModal
        visible={showFAQModal}
        onClose={handleOnClose}
        title={t("ProfileDetails.ProfileDetailsScreen.contextualFAQModal.title")}
        content={t("ProfileDetails.ProfileDetailsScreen.contextualFAQModal.content")}
        faqId="update-contact-faq"
      />
    </Page>
  );
}

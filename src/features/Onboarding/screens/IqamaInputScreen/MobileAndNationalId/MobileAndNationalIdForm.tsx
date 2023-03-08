import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle, Pressable, Text, View, ViewStyle } from "react-native";

import Banner from "@/components/Banner";
import ContentContainer from "@/components/ContentContainer";
import InputLabel from "@/components/Form/internal/InputLabel";
import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import InfoBox from "@/components/InfoBox";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ErrorMessageType } from "..";
import IqamaInputs from "../IqamaInputs";
import { iqamaValidationSchema } from "./IqamaValidation";

interface MobileAndNationalIdFormProps {
  onSubmit: (values: IqamaInputs) => Promise<void>;
  onSigninPress: () => void;
  errorMessages: ErrorMessageType[];
}

export default function MobileAndNationalIdForm({
  onSubmit,
  onSigninPress,
  errorMessages,
}: MobileAndNationalIdFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IqamaInputs>({
    resolver: yupResolver(iqamaValidationSchema),
    mode: "onBlur",
  });

  const headerViewStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  const headerTitleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginVertical: theme.spacing["24p"],
  }));

  const areaCodeViewStyle = useThemeStyles<ViewStyle>(theme => ({
    alignItems: "center",
    backgroundColor: theme.palette["neutralBase-50"],
    borderColor: theme.palette["neutralBase-20"],
    borderRadius: theme.radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    height: 54,
    justifyContent: "center",
    paddingHorizontal: theme.spacing["8p"],
    marginRight: theme.spacing["8p"],
  }));

  const iconStyle = useThemeStyles<ImageStyle>(theme => ({
    borderRadius: theme.radii.medium,
    height: theme.iconDimensions.notifications,
    marginRight: 4,
    width: theme.iconDimensions.notifications,
  }));

  const inputFieldsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const errorsMobileNumberStyle = useThemeStyles<ViewStyle>(theme => ({
    borderWidth: 2,
    backgroundColor: theme.palette["errorBase-40"],
    borderColor: theme.palette["errorBase-10"],
  }));

  const accountSignInStyle = useThemeStyles<ViewStyle>(theme => ({
    alignSelf: "center",
    flexDirection: "row",
    marginTop: theme.spacing["8p"],
  }));

  const submitButtonView = useThemeStyles<ViewStyle>(theme => ({
    paddingHorizontal: theme.spacing["16p"],
  }));

  return (
    <>
      <ContentContainer isScrollView style={{ flex: 1 }}>
        <View style={headerViewStyle}>
          <Typography.Text size="large" weight="bold" style={headerTitleStyle}>
            {t("Onboarding.IqamaInputScreen.title")}
          </Typography.Text>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subTitle")}
          </Typography.Text>
        </View>
        <View>
          <View style={inputFieldsStyle}>
            <Stack direction="vertical" align="stretch" gap="20p">
              {errorMessages.map((err, index: number) =>
                typeof err.message === "string" ? (
                  <Banner key={`err_${index}`} variant={err.backgroundColor} icon={err.icon} message={err.message} />
                ) : (
                  <InfoBox key={`err_${index}`} variant="compliment" borderPosition="start">
                    {err.link ? (
                      <Pressable onPress={onSigninPress}>
                        <Typography.Text size="footnote" weight="regular">
                          {err.message}
                        </Typography.Text>
                      </Pressable>
                    ) : (
                      <Typography.Text size="footnote" weight="regular">
                        {err.message}
                      </Typography.Text>
                    )}
                  </InfoBox>
                )
              )}
              <View>
                <InputLabel>{t("Onboarding.IqamaInputScreen.mobileLabel")}</InputLabel>
                <View style={{ flexDirection: "row" }}>
                  <View style={[areaCodeViewStyle, undefined !== errors?.MobileNumber && errorsMobileNumberStyle]}>
                    <View>
                      <Image style={iconStyle} source={require("./ksa-flag.png")} />
                    </View>
                    <Text>+966</Text>
                  </View>
                  <PhoneNumberInput<IqamaInputs>
                    control={control}
                    name="MobileNumber"
                    placeholder={t("Onboarding.IqamaInputScreen.mobilePlaceholder")}
                  />
                </View>
              </View>
              <TextInput
                control={control}
                name="NationalId"
                label={t("Onboarding.IqamaInputScreen.iqamaLabel")}
                placeholder={t("Onboarding.IqamaInputScreen.iqamaPlaceholder")}
                keyboardType="number-pad"
              />
              <InfoBox variant="compliment" borderPosition="start">
                {t("Onboarding.IqamaInputScreen.notificationText.one")}
                <Typography.Text color="neutralBase+30" size="caption1" weight="bold">
                  {t("Onboarding.IqamaInputScreen.notificationText.two")}
                </Typography.Text>
                {t("Onboarding.IqamaInputScreen.notificationText.three")}
              </InfoBox>
            </Stack>
          </View>
        </View>
      </ContentContainer>
      <View style={submitButtonView}>
        <SubmitButton block control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("Onboarding.IqamaInputScreen.continue")}
        </SubmitButton>
        <View style={accountSignInStyle}>
          <Typography.Text size="callout" weight="regular">
            {t("Onboarding.IqamaInputScreen.subtext")}
          </Typography.Text>
          <Pressable onPress={onSigninPress}>
            <Typography.Text size="callout" weight="regular" color="primaryBase">
              {t("Onboarding.IqamaInputScreen.signIn")}
            </Typography.Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

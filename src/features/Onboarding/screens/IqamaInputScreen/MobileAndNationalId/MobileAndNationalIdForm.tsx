import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Image, ImageStyle, StyleSheet, Text, View, ViewStyle } from "react-native";

import PhoneNumberInput from "@/components/Form/PhoneNumberInput";
import SubmitButton from "@/components/Form/SubmitButton";
import TextInput from "@/components/Form/TextInput";
import InfoBox from "@/components/InfoBox";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";
import { vh, vw } from "@/theme/viewportUnit";

import IqamaInputs from "../IqamaInputs";
import { iqamaValidationSchema } from "./IqamaValidation";

interface MobileAndNationalIdFormProps {
  onSubmit: (values: IqamaInputs) => Promise<void>;
}

export default function MobileAndNationalIdForm({ onSubmit }: MobileAndNationalIdFormProps) {
  const { t, i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IqamaInputs>({
    resolver: yupResolver(iqamaValidationSchema),
    mode: "onBlur",
  });

  const areaCodeViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      alignItems: "center",
      backgroundColor: theme.palette["neutralBase-50"],
      borderColor: theme.palette["neutralBase-20"],
      borderRadius: theme.radii.extraSmall,
      borderWidth: 1,
      flexDirection: "row",
      height: 54,
      justifyContent: "center",
      marginRight: theme.spacing.small,
      width: 24 * vw,
    }),
    []
  );
  const iconStyle = useThemeStyles<ImageStyle>(
    theme => ({
      borderRadius: theme.radii.medium,
      height: theme.iconDimensions.notifications,
      marginRight: 4,
      width: theme.iconDimensions.notifications,
    }),
    []
  );
  const inputFieldsStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginBottom: theme.spacing.medium,
    }),
    []
  );
  const mobileNumberContainerStyle = useThemeStyles<ViewStyle>(
    theme => ({
      flexDirection: "row",
      marginBottom: theme.spacing.medium,
      marginTop: theme.spacing.small,
    }),
    []
  );
  const errorsMobileNumberStyle = useThemeStyles<ViewStyle>(
    theme => ({
      borderWidth: 2,
      backgroundColor: theme.palette["errorBase-40"],
      borderColor: theme.palette["errorBase-10"],
    }),
    []
  );

  return (
    <View>
      <View style={inputFieldsStyle}>
        <View>
          <Typography.Text size="callout" weight="medium" color="neutralBase+30">
            {t("Onboarding.IqamaInputScreen.mobileLabel")}
          </Typography.Text>
          <View style={mobileNumberContainerStyle}>
            <View style={[areaCodeViewStyle, undefined !== errors?.MobileNumber && errorsMobileNumberStyle]}>
              <View>
                <Image style={iconStyle} source={require("@/assets/images/KSAFlag.png")} />
              </View>
              <Text>+966</Text>
            </View>
            <View style={styles.mobile}>
              <PhoneNumberInput
                control={control}
                name="MobileNumber"
                placeholder="Enter mobile"
                autoCompleteType="mobile"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
        <TextInput
          control={control}
          name="NationalId"
          label={t("Onboarding.IqamaInputScreen.iqamaLabel")}
          placeholder={t("Onboarding.IqamaInputScreen.iqamaPlaceholder")}
          keyboardType="number-pad"
        />
      </View>
      <InfoBox variant="compliment" borderPosition="left">
        <Typography.Text color="primaryBase+30" size="caption1" weight="regular">
          {t("Onboarding.IqamaInputScreen.notificationText.one")}
          <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
            {t("Onboarding.IqamaInputScreen.notificationText.two")}
          </Typography.Text>
          {t("Onboarding.IqamaInputScreen.notificationText.three")}
        </Typography.Text>
      </InfoBox>
      <View style={styles.submitButtonView}>
        <SubmitButton control={control} onSubmit={handleSubmit(onSubmit)}>
          {t("Onboarding.IqamaInputScreen.continue")}
        </SubmitButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobile: {
    width: 64 * vw,
  },
  submitButtonView: {
    marginTop: 24 * vh,
  },
});

import { Field, Formik, FormikHelpers } from "formik";
import { Image, StyleSheet, Text, View } from "react-native";

import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import MobileNumberField from "@/components/MobileNumberField";
import TextField from "@/components/TextField";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";
import { vh, vw } from "@/theme/viewportUnit";

import { iqamaValidationSchema } from "./IqamaValidation";

interface Values {
  mobileNumber: string;
  idNumber: string;
}

const MobileAndNationalIdForm = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Formik
        initialValues={{
          mobileNumber: "",
          idNumber: "",
        }}
        validationSchema={iqamaValidationSchema}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
          setTimeout(() => {
            setSubmitting(false);
            navigation.navigate("Onboarding.Nafath");
          }, 500);
        }}>
        {({ errors }) => {
          let areaViewMobileCode;
          errors.mobileNumber
            ? (areaViewMobileCode = [
                styles.areaCodeView,
                { borderWidth: 2, backgroundColor: palette["errorBase-40"], borderColor: palette["errorBase-10"] },
              ])
            : (areaViewMobileCode = styles.areaCodeView);

          return (
            <View>
              <View style={styles.inputFields}>
                <View>
                  <Typography.Text size="callout" weight="medium" color="neutralBase+30">
                    Mobile
                  </Typography.Text>
                  <View style={styles.mobileNumberContainer}>
                    <View style={areaViewMobileCode}>
                      <View>
                        <Image style={styles.icon} source={require("@/assets/images/KSAFlag.png")} />
                      </View>
                      <Text>+966</Text>
                    </View>
                    <View style={styles.mobile}>
                      <Field
                        component={MobileNumberField}
                        name="mobileNumber"
                        placeholder="Enter mobile"
                        autoCompleteType="mobile"
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </View>
                <TextField
                  name="idNumber"
                  label="National ID or Iqama Number"
                  placeholder="Enter your national ID/Iqama"
                  keyboardType="number-pad"
                />
              </View>
              <Toast variant="compliment" borderPosition="left">
                <Typography.Text color="primaryBase+30" size="caption1" weight="regular">
                  To join Croatia, you must be over 18 and have an Absher profile. Register at
                  <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
                    {" "}
                    absher.sa
                  </Typography.Text>{" "}
                  before joining us
                </Typography.Text>
              </Toast>
              <View style={styles.submitButtonView}>
                <FormSubmitButton title="Continue" />
              </View>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default MobileAndNationalIdForm;

const styles = StyleSheet.create({
  areaCodeView: {
    alignItems: "center",
    backgroundColor: palette["neutralBase-50"],
    borderColor: palette["neutralBase-20"],
    borderRadius: radii.extraSmall,
    borderWidth: 1,
    flexDirection: "row",
    height: 54,
    justifyContent: "center",
    marginRight: spacing.small,
    width: 24 * vw,
  },
  icon: {
    borderRadius: radii.medium,
    height: iconDimensions.notifications,
    marginRight: 4,
    width: iconDimensions.notifications,
  },
  inputFields: {
    marginBottom: spacing.medium,
  },
  mobile: { width: 64 * vw },

  mobileNumberContainer: {
    flexDirection: "row",
    marginBottom: spacing.medium,
    marginTop: spacing.small,
  },
  submitButtonView: { marginTop: 28 * vh },
});

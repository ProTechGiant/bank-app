import { Field, Formik, FormikHelpers } from "formik";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import MobileNumberField from "@/components/MobileNumberField/MobileNumberField";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import TextField from "@/components/TextField/TextField";
import { vh, vw } from "@/helpers/viewportUnit";
import { iconDimensions, palette, radii, spacing } from "@/theme/values";

import { iqamaValidationSchema } from "./IqamaValidation";
import Typography from "@/components/Typography";
import useNavigation from "@/navigation/use-navigation";

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
          const errorColor = errors.mobileNumber ? "errorBase" : "neutralBase+30";
          let areaViewMobileCode;
          if (errors.mobileNumber) {
            areaViewMobileCode = [
              styles.areaCodeView,
              { borderWidth: 2, backgroundColor: palette["errorBase-40"], borderColor: palette["errorBase-10"] },
            ];
          } else {
            areaViewMobileCode = styles.areaCodeView;
          }
          return (
            <View>
              <View style={styles.inputFields}>
                <View>
                  <Typography.Text size="callout" weight="medium" color={errorColor}>
                    Mobile Number
                  </Typography.Text>
                  <View style={styles.mobileNumberContainer}>
                    <View style={areaViewMobileCode}>
                      <View>
                        <Image style={styles.icon} source={require("../../../assets/images/KSAFlag.png")} />
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
                  label="National ID/Iqama Number"
                  placeholder="Enter your national ID/Iqama"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.infoBlock}>
                <Typography.Text color="primaryBase+30" size="caption1" weight="regular" style={styles.infoBlockText}>
                  To join Croatia, you must be over 18 years old and have an Absher profile. Visit
                  <Typography.Text color="primaryBase+30" size="caption1" weight="bold">
                    {" "}
                    absher.sa
                  </Typography.Text>{" "}
                  to register before joining us
                </Typography.Text>
              </View>
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
  infoBlock: {
    backgroundColor: palette["neutralBase-50"],
    borderLeftColor: palette.complimentBase,
    borderLeftWidth: 5,
    borderRadius: radii.extraSmall,
  },
  infoBlockText: {
    padding: spacing.medium,
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
  submitButtonView: { marginTop: 25 * vh },
});

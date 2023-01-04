import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View } from "react-native";

import Button from "@/components/Button";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import { Stack } from "@/components/Stack";
import TextField from "@/components/TextField";
import useNavigation from "@/navigation/use-navigation";

import { stayUpdatedEmailValidationSchema } from "./StayUpdatedEmailValidation";

interface Values {
  emailAddress: string;
}

const StayUpdatedEmailForm = () => {
  const navigation = useNavigation();

  const handleOnContinueOnboarding = () => {
    navigation.navigate("Onboarding.Financial");
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          emailAddress: "",
        }}
        validationSchema={stayUpdatedEmailValidationSchema}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
          setTimeout(() => {
            setSubmitting(false);
            navigation.navigate("Onboarding.Financial");
          }, 500);
        }}>
        <>
          <TextField name="emailAddress" label="Email" placeholder="Your address" keyboardType="email-address" />
          <View style={styles.buttonView}>
            <Stack space="xSmall">
              <FormSubmitButton title="Continue" />
              <Button variant="secondary" color="base" onPress={handleOnContinueOnboarding}>
                Skip
              </Button>
            </Stack>
          </View>
        </>
      </Formik>
    </View>
  );
};

export default StayUpdatedEmailForm;

const styles = StyleSheet.create({
  buttonView: {
    marginTop: "auto",
  },
  container: {
    flex: 1,
  },
});

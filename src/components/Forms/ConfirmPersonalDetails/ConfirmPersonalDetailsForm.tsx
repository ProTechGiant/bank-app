import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View } from "react-native";

import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import { spacing } from "@/theme/values";

import useNavigation from "@/navigation/use-navigation";
import Checkbox from "@/components/Checkbox";

interface Values {
  detailsConfirmed: boolean;
}

const ConfirmPersonalDetailsForm = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          detailsConfirmed: false,
        }}
        onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
          setTimeout(() => {
            setSubmitting(false);
            navigation.navigate("Onboarding.OptionalEmail");
          }, 500);
        }}>
        <>
          <Checkbox title="I confirm my details are correct" name="detailsConfirmed" border={false} />
          <View style={styles.buttonView}>
            <FormSubmitButton title="Continue" />
          </View>
        </>
      </Formik>
    </View>
  );
};

export default ConfirmPersonalDetailsForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 30,
  },
  buttonView: {
    marginHorizontal: spacing.medium,
  },
});

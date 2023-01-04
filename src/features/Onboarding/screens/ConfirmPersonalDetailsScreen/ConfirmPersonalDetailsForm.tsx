import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View } from "react-native";

import Checkbox from "@/components/Checkbox";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";

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
  buttonView: {
    marginHorizontal: spacing.medium,
  },
  container: {
    paddingBottom: 30,
    width: "100%",
  },
});

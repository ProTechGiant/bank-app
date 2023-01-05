import { Formik, FormikHelpers } from "formik";
import { StyleSheet, View, ViewStyle } from "react-native";

import Checkbox from "@/components/Checkbox";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import useNavigation from "@/navigation/use-navigation";
import { useThemeStyles } from "@/theme";

interface Values {
  detailsConfirmed: boolean;
}

const ConfirmPersonalDetailsForm = () => {
  const buttonViewStyle = useThemeStyles<ViewStyle>(
    theme => ({
      marginHorizontal: theme.spacing.medium,
    }),
    []
  );

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
          <View style={buttonViewStyle}>
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
    paddingBottom: 30,
    width: "100%",
  },
});

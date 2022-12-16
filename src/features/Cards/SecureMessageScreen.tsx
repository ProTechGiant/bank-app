import { SafeAreaView, StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import { alphaNumericSpaceRegExp } from "@/utils/strings";
import ApplyCardHeader from "@/components/ApplyForCardHeader";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toast from "@/components/Toast";
import Typography from "@/components/Typography";
import TextField from "@/components/TextField/TextField";
import FormSubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import useNavigation from "@/navigation/use-navigation";
import { spacing } from "@/theme/values";
import HideKeyboard from "@/helpers/HideKeyboard";

type SecureMessageFormValuesType = {
  secureMessage: string;
};

const validationSchema = Yup.object().shape({
  secureMessage: Yup.string()
    .required("Personal message is required")
    .matches(alphaNumericSpaceRegExp, "Personal message is not valid")
    .min(10, "Minimum 10 characters")
    .max(45, "Maximum 45 characters"),
});

export default function SecureMessageScreen() {
  const navigation = useNavigation();

  return (
    <HideKeyboard>
      <SafeAreaView style={{ flex: 1 }}>
        <ApplyCardHeader title="Order card" backButton={true} />
        <View style={styles.container}>
          <View style={styles.progressIndicator}>
            <ProgressIndicator currentStep={1} totalStep={4} />
          </View>
          <View style={styles.header}>
            <Typography.Text size="large" weight="bold">
              Set up 3D Secure Payments
            </Typography.Text>
          </View>
          <Formik
            initialValues={{
              secureMessage: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values: SecureMessageFormValuesType, { setSubmitting }) => {
              console.log(values);
              setTimeout(() => {
                setSubmitting(false);
                navigation.navigate("Cards.CreateCardPin");
              }, 500);
            }}>
            {({ setFieldTouched }) => {
              return (
                <View style={styles.contentContainer}>
                  <View>
                    <View style={styles.paragraph}>
                      <Typography.Text>
                        Enter a message of your choice below. It’ll appear when you make a payment so you know it’s a
                        genuine transaction.
                      </Typography.Text>
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                      <TextField
                        name="secureMessage"
                        placeholder="Enter personal message ..."
                        helperText="*Required"
                        onChange={() => {
                          setFieldTouched("secureMessage", true);
                        }}
                        hasCharacterCount
                        maxLength={45}
                        multiline
                        numberOfLines={2}
                        returnKeyType="done"
                        blurOnSubmit={true}
                      />
                    </View>
                    <Toast
                      borderPosition="left"
                      title="What is 3D Secure?"
                      content="An extra layer of security. If you don’t see your message when you’re making a payment, it could be fraud."
                      variant="compliment"
                    />
                  </View>
                  <View style={styles.button}>
                    <FormSubmitButton title="Save and continue" />
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </SafeAreaView>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
  },
  contentContainer: {
    flex: 1,
  },
  progressIndicator: {
    marginTop: 12,
    marginBottom: 44,
  },
  header: {
    paddingBottom: spacing.medium,
  },
  paragraph: {
    paddingBottom: spacing.large,
  },
  button: {
    minWidth: 350,
    marginTop: "auto",
  },
});
